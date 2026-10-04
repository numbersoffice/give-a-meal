import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import staffAcceptedTemplate from "@/components/emailTemplates/staffAccepted";
import { NextRequest, NextResponse } from "next/server";

// acceptTeamRequest
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { verificationId, businessId } = await request.json();
    await verifyBusinessMembership(authData, businessId, true);

    if (!verificationId)
      throw new ApiError(400, "Missing parameter: verificationId.");

    const payload = await getPayload({ config });

    // Get verification entry
    const verification = await payload
      .findByID({ collection: "verifications", id: verificationId, depth: 0 })
      .catch(() => null);

    if (!verification || String(verification.business) !== String(businessId))
      throw new ApiError(404, "Verification entry not found.");

    // The requester registered (with a password) before sending the request
    const { docs: existingUsers } = await payload.find({
      collection: "businessUsers",
      where: { email: { equals: verification.verificationEmail } },
      limit: 1,
    });

    if (existingUsers.length === 0)
      throw new ApiError(404, "The user who sent this request no longer exists.");

    // Add business to their staffBusinesses
    const businessUser = existingUsers[0];
    const currentStaff = ((businessUser.staffBusinesses as any[]) ?? []).map(
      (b: any) => (typeof b === "object" ? b.id : b)
    );
    await payload.update({
      collection: "businessUsers",
      id: businessUser.id,
      data: {
        staffBusinesses: [...currentStaff, businessId],
      },
    });

    // Delete verification entry
    await payload.delete({
      collection: "verifications",
      id: verificationId,
    });

    // Notify employee
    const business = await payload.findByID({
      collection: "businesses",
      id: businessId,
    });

    const template = staffAcceptedTemplate({
      businessName: business.businessName,
    });
    await payload.sendEmail({
      to: verification.verificationEmail!,
      subject: "Verification request accepted",
      text: template.text,
      html: template.html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
