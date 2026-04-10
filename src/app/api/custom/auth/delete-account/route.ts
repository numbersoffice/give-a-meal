import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// deleteAccount (business users only)
export async function DELETE(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const payload = await getPayload({ config });

    const body = await request.json();
    const { businessId: targetBusinessId } = body;
    if (!targetBusinessId) {
      throw new ApiError(400, "businessId is required.");
    }

    // Find the authenticated business user
    const { docs } = await payload.find({
      collection: "businessUsers",
      where: { email: { equals: authData.email } },
      limit: 1,
    });

    if (docs.length === 0) throw new ApiError(404, "User not found.");

    const user = docs[0];
    const ownedIds = ((user.ownedBusinesses as any[]) ?? []).map((b: any) =>
      typeof b === "object" ? b.id : b,
    );
    const staffIds = ((user.staffBusinesses as any[]) ?? []).map((b: any) =>
      typeof b === "object" ? b.id : b,
    );
    const allBusinessIds = [...new Set([...ownedIds, ...staffIds])];

    // Verify the user is an owner or staff of the target business
    if (!allBusinessIds.includes(targetBusinessId) && !allBusinessIds.includes(String(targetBusinessId))) {
      throw new ApiError(403, "You are not an owner or staff member of this business.");
    }

    // For each business, check ownership constraints
    for (const businessId of allBusinessIds) {
      // Find all other owners of this business (excluding the current user)
      const { docs: otherOwners } = await payload.find({
        collection: "businessUsers",
        where: {
          and: [
            { id: { not_equals: user.id } },
            { ownedBusinesses: { in: [businessId] } },
          ],
        },
        limit: 1,
      });

      const isOwner = ownedIds.includes(businessId) || ownedIds.includes(String(businessId));
      const hasOtherOwners = otherOwners.length > 0;

      // Find all other staff/owners associated with this business (excluding the current user)
      const { docs: otherMembers } = await payload.find({
        collection: "businessUsers",
        where: {
          and: [
            { id: { not_equals: user.id } },
            {
              or: [
                { ownedBusinesses: { in: [businessId] } },
                { staffBusinesses: { in: [businessId] } },
              ],
            },
          ],
        },
        limit: 1,
      });

      const isLastMember = otherMembers.length === 0;

      // If user is an owner and there are no other owners, but there ARE other staff members,
      // the business would be orphaned without an owner — block deletion
      if (isOwner && !hasOtherOwners && !isLastMember) {
        throw new ApiError(
          409,
          `You are the only owner of a business that still has other team members. Transfer ownership before deleting your account.`,
        );
      }

      // If this user is the last member of the business, we need to check for unredeemed donations
      if (isLastMember) {
        const { totalDocs: unredeemedCount } = await payload.find({
          collection: "donations",
          where: {
            and: [
              { business: { equals: businessId } },
              { redeemedAt: { exists: false } },
            ],
          },
          limit: 0,
        });

        if (unredeemedCount > 0) {
          throw new ApiError(
            409,
            `There are unredeemed donations for a business you are the last member of. Ensure all donations are redeemed first.`,
          );
        }
      }
    }

    // All checks passed — perform deletions

    // If this user is the last member of the target business, mark it as inactive
    const { docs: otherMembersOfTarget } = await payload.find({
      collection: "businessUsers",
      where: {
        and: [
          { id: { not_equals: user.id } },
          {
            or: [
              { ownedBusinesses: { in: [targetBusinessId] } },
              { staffBusinesses: { in: [targetBusinessId] } },
            ],
          },
        ],
      },
      limit: 1,
    });

    if (otherMembersOfTarget.length === 0) {
      await payload.update({
        collection: "businesses",
        id: targetBusinessId,
        data: { inactive: true },
      });
    }

    // Nullify references to this user on remaining donations
    await payload.update({
      collection: "donations",
      where: { createdBy: { equals: user.id } },
      data: { createdBy: null as any },
    });
    await payload.update({
      collection: "donations",
      where: { redeemedBy: { equals: user.id } },
      data: { redeemedBy: null as any },
    });

    // Delete the business user account
    await payload.delete({
      collection: "businessUsers",
      id: user.id,
    });

    // Revoke the access token by clearing the auth cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete("payload-token");
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
