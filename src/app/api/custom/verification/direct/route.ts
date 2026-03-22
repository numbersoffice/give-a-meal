import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { getBusinessDetailsFromGoogle } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// directOwnerVerification
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { placeId } = await request.json();

    if (!placeId) throw new ApiError(400, "Missing parameter placeId.");

    const details: any = await getBusinessDetailsFromGoogle(placeId);
    if (!details || !details.website)
      throw new ApiError(503, "Failed to fetch business details.");

    const businessDomain = new URL(details.website).host.replace("www.", "");
    const userDomainParts = authData.email.split("@");
    const userDomain = userDomainParts[userDomainParts.length - 1];

    if (businessDomain !== userDomain)
      throw new ApiError(401, "Email address doesn't match business website.");

    const payload = await getPayload({ config });

    // Create business
    const business = await payload.create({
      collection: "businesses",
      data: {
        placeId: details.placeId,
        businessName: details.name,
        address: details.address.address ?? "",
        streetNumber: details.address.streetNumber ?? "",
        city: details.address.city ?? "",
        postalCode: details.address.postalCode ?? "",
        state: details.address.state ?? "",
        country: details.address.country ?? "",
        location: [details.location.lng, details.location.lat],
        inactive: false,
      },
    });

    // Find or create business user
    const { docs: existingUsers } = await payload.find({
      collection: "businessUsers",
      where: { email: { equals: authData.email } },
      limit: 1,
    });

    let businessUser;
    if (existingUsers.length > 0) {
      businessUser = existingUsers[0];
      const currentOwned = ((businessUser.ownedBusinesses as any[]) ?? []).map(
        (b: any) => (typeof b === "object" ? b.id : b)
      );
      businessUser = await payload.update({
        collection: "businessUsers",
        id: businessUser.id,
        data: { ownedBusinesses: [...currentOwned, business.id] },
      });
    } else {
      businessUser = await payload.create({
        collection: "businessUsers",
        data: {
          email: authData.email,
          ownedBusinesses: [business.id],
        },
      });
    }

    return NextResponse.json({ business, profile: businessUser });
  } catch (error) {
    return errorResponse(error);
  }
}
