import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import Anthropic from "@anthropic-ai/sdk";
import { SMS_SYSTEM_PROMPT } from "@/lib/sms/systemPrompt";
import { smsTools, executeToolCall } from "@/lib/sms/tools";
import { sendSms, validateTwilioWebhook } from "@/lib/sms/twilio";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as Record<string, string>;

    // Validate Twilio webhook signature
    const signature = request.headers.get("x-twilio-signature") || "";
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/custom/sms/incoming`;
    if (!validateTwilioWebhook(signature, url, body)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const phoneNumber = body.From;
    const messageBody = body.Body?.trim();

    if (!phoneNumber || !messageBody) {
      return twimlResponse();
    }

    const payload = await getPayload({ config });

    // Load conversation history for this phone number
    const { docs: messageDocs } = await payload.find({
      collection: "sms-messages",
      where: { phoneNumber: { equals: phoneNumber } },
      sort: "createdAt",
      limit: 50,
    });

    // Build Claude messages from history
    const claudeMessages: Anthropic.MessageParam[] = messageDocs.map((doc) => ({
      role: doc.role as "user" | "assistant",
      content: doc.content,
    }));

    // Add the new user message
    claudeMessages.push({ role: "user", content: messageBody });

    // Call Claude with tools
    let response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SMS_SYSTEM_PROMPT,
      tools: smsTools,
      messages: claudeMessages,
    });

    // Process tool calls in a loop until we get a final text response
    while (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (block) => block.type === "tool_use",
      );

      // Add assistant message with tool calls
      claudeMessages.push({
        role: "assistant",
        content: response.content.map((block) => {
          if (block.type === "tool_use") {
            return { type: "tool_use" as const, id: block.id, name: block.name, input: block.input };
          }
          return { type: "text" as const, text: (block as Anthropic.TextBlock).text };
        }),
      });

      // Execute each tool call and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = await Promise.all(
        toolUseBlocks.map(async (toolUse) => {
          if (toolUse.type !== "tool_use") throw new Error("unexpected");
          return {
            type: "tool_result" as const,
            tool_use_id: toolUse.id,
            content: await executeToolCall(
              toolUse.name,
              toolUse.input as Record<string, string>,
              phoneNumber,
            ),
          };
        }),
      );

      claudeMessages.push({ role: "user", content: toolResults });

      // Call Claude again with tool results
      response = await anthropic.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: SMS_SYSTEM_PROMPT,
        tools: smsTools,
        messages: claudeMessages,
      });
    }

    // Extract final text response
    const replyText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Save user message and assistant reply as individual docs
    await Promise.all([
      payload.create({
        collection: "sms-messages",
        data: { phoneNumber, role: "user", content: messageBody, expiresAt },
      }),
      payload.create({
        collection: "sms-messages",
        data: { phoneNumber, role: "assistant", content: replyText, expiresAt },
      }),
    ]);

    // Send SMS reply
    await sendSms(phoneNumber, replyText);

    return twimlResponse();
  } catch (error) {
    console.error("SMS webhook error:", error);
    return twimlResponse();
  }
}

/** Return an empty TwiML response (we send replies via the API instead) */
function twimlResponse() {
  return new NextResponse(
    '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
    {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    },
  );
}
