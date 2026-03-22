import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// removeTeamMember
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { profileId, businessId } = await request.json();
    const { role } = await verifyBusinessMembership(authData, businessId, true);

    if (!profileId)
      throw new ApiError(400, "Missing parameter: profileId.");

    const payload = await getPayload({ config });

    const member = await payload.findByID({
      collection: "businessUsers",
      id: profileId,
    });

    // Remove business from both owned and staff arrays
    const ownedIds = ((member.ownedBusinesses as any[]) ?? [])
      .map((b: any) => (typeof b === "object" ? b.id : b))
      .filter((id: any) => String(id) !== String(businessId));

    const staffIds = ((member.staffBusinesses as any[]) ?? [])
      .map((b: any) => (typeof b === "object" ? b.id : b))
      .filter((id: any) => String(id) !== String(businessId));

    await payload.update({
      collection: "businessUsers",
      id: profileId,
      data: {
        ownedBusinesses: ownedIds,
        staffBusinesses: staffIds,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
