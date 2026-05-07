import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || "";

const client = twilio(accountSid, authToken);

export async function sendSms(to: string, body: string) {
  return client.messages.create({
    body,
    from: twilioPhoneNumber,
    to,
  });
}

export function validateTwilioWebhook(
  signature: string,
  url: string,
  params: Record<string, string>,
): boolean {
  return twilio.validateRequest(authToken, signature, url, params);
}
