import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import staffDeclinedTemplate from "@/components/emailTemplates/staffDeclined";
import { NextRequest, NextResponse } from "next/server";

// declineTeamRequest
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { verificationId, businessId } = await request.json();
    await verifyBusinessMembership(authData, businessId, true);

    if (!verificationId)
      throw new ApiError(400, "Missing parameter: verificationId.");

    const payload = await getPayload({ config });

    // Get verification before deleting (for email)
    const verification = await payload
      .findByID({ collection: "verifications", id: verificationId, depth: 0 })
      .catch(() => null);

    if (!verification || String(verification.business) !== String(businessId))
      throw new ApiError(404, "Verification entry not found.");

    const verificationEmail = verification.verificationEmail ?? undefined;

    await payload.delete({
      collection: "verifications",
      id: verificationId,
    });

    // Notify employee
    if (verificationEmail) {
      const business = await payload.findByID({
        collection: "businesses",
        id: businessId,
      });

      const template = staffDeclinedTemplate({
        businessName: business.businessName,
      });
      await payload.sendEmail({
        to: verificationEmail,
        subject: "Verification request declined",
        text: template.text,
        html: template.html,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
