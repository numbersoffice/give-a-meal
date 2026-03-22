import { errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { getBusinessDetailsFromGoogle } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// getUserStatus
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    if (!email) throw new ApiError(400, "Missing query parameter: email.");

    const payload = await getPayload({ config });

    // Check if user has a business user profile with business affiliations
    const { docs: users } = await payload.find({
      collection: "businessUsers",
      where: { email: { equals: email } },
      depth: 1,
      limit: 1,
    });

    if (users.length > 0) {
      const user = users[0];
      const ownedBusinesses = (user.ownedBusinesses as any[]) ?? [];
      const staffBusinesses = (user.staffBusinesses as any[]) ?? [];

      if (ownedBusinesses.length > 0 || staffBusinesses.length > 0) {
        const business = ownedBusinesses[0] ?? staffBusinesses[0];
        const businessObj = typeof business === "object" ? business : null;
        // Rework this logic to make it more resilient and prepare for multiple roles in the future
        const connectionType = ownedBusinesses.length > 0 ? "admin" : "user";

        console.log({
          verificationStatus: "full",
          business: businessObj,
          profile: user,
          verification: {
            verificationMode: null,
            connectionType,
          },
        })

        return NextResponse.json({
          verificationStatus: "full",
          business: businessObj,
          profile: user,
          verification: {
            verificationMode: null,
            connectionType,
          },
        });
      }
    }

    // Check for active business verification
    const { docs: verifications } = await payload.find({
      collection: "verifications",
      where: {
        "businessUser.email": { equals: email },
      },
      depth: 1,
      limit: 1,
    });

    if (verifications.length > 0) {
      const verification = verifications[0];
      const business =
        typeof verification.business === "object"
          ? verification.business
          : null;

      if (business) {
        return NextResponse.json({
          verificationStatus: "verificationPending",
          business,
          profile: null,
          verification: {
            verificationMode: verification.verificationMode,
            connectionType: verification.connectionType,
          },
        });
      } else if (verification.placeId) {
        const details = await getBusinessDetailsFromGoogle(
          verification.placeId,
        );
        if (!details) throw new ApiError(500, "Failed to load user info");

        return NextResponse.json({
          verificationStatus: "verificationPending",
          verification: {
            verificationMode: verification.verificationMode,
            connectionType: verification.connectionType,
          },
          business: {
            id: null,
            placeId: verification.placeId,
            createdAt: null,
            updatedAt: null,
            businessName: details.name,
            phone: details.internationalPhoneNumber,
            email: null,
            website: details.website,
            ...details.address,
            lat: details.location.lat,
            lon: details.location.lng,
          },
          profile: null,
        });
      }
    }

    return NextResponse.json({
      data: {
        verificationStatus: "new",
        business: null,
        profile: null,
        verification: { verificationMode: null, connectionType: null },
        _verified: users[0]?._verified,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
