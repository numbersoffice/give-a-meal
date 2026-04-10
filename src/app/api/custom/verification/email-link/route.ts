import { getPayload } from "payload";
import config from "@payload-config";
import { getBusinessDetailsFromGoogle } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// verifyOwnerByEmailLink
export async function GET(request: NextRequest) {
  const verificationKey = request.nextUrl.searchParams.get("key");
  if (!verificationKey) {
    return new NextResponse(
      `<html><body><h1>Error</h1><p>Key missing.</p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  try {
    const payload = await getPayload({ config });

    // Find the verification key
    const { docs: keyDocs } = await payload.find({
      collection: "verification-keys",
      where: { key: { equals: verificationKey } },
      depth: 1,
      limit: 1,
    });

    if (keyDocs.length === 0) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>This verification link has expired.</p></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    const keyDoc = keyDocs[0];
    const verification = typeof keyDoc.verification === "object"
      ? keyDoc.verification
      : null;

    if (!verification || verification.connectionType !== "admin") {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>This verification link has expired.</p></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    const businessDetails = await getBusinessDetailsFromGoogle(verification.placeId!);
    if (!businessDetails) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>Failed to fetch business details.</p></body></html>`,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    // Check if a business with this placeId already exists (reactivation case)
    const { docs: existingBusinesses } = await payload.find({
      collection: "businesses",
      where: { placeId: { equals: verification.placeId! } },
      limit: 1,
    });

    let business;
    if (existingBusinesses.length > 0) {
      // Reactivate existing business
      business = await payload.update({
        collection: "businesses",
        id: existingBusinesses[0].id,
        data: { inactive: false },
      });
    } else {
      // Create new business
      business = await payload.create({
        collection: "businesses",
        data: {
          placeId: verification.placeId!,
          businessName: businessDetails.name,
          address: businessDetails.address.address ?? "",
          streetNumber: businessDetails.address.streetNumber ?? "",
          city: businessDetails.address.city ?? "",
          postalCode: businessDetails.address.postalCode ?? "",
          state: businessDetails.address.state ?? "",
          country: businessDetails.address.country ?? "",
          location: [businessDetails.location.lng, businessDetails.location.lat],
          inactive: false,
        },
      });
    }

    // Find the business user linked to this verification and add the business
    const businessUserId = typeof verification.businessUser === "object"
      ? verification.businessUser.id
      : verification.businessUser;

    const businessUser = await payload.findByID({
      collection: "businessUsers",
      id: businessUserId,
    });

    const currentOwned = ((businessUser.ownedBusinesses as any[]) ?? []).map(
      (b: any) => (typeof b === "object" ? b.id : b)
    );

    await payload.update({
      collection: "businessUsers",
      id: businessUserId,
      data: { ownedBusinesses: [...currentOwned, business.id] },
    });

    // Clean up
    await payload.delete({
      collection: "verification-keys",
      id: keyDoc.id,
    });

    await payload.delete({
      collection: "verifications",
      id: verification.id,
    });

    return new NextResponse(
      `<html><body><h1>Verification successful</h1><p>You can now leave this site and return to the app.</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch {
    return new NextResponse(
      `<html><body><h1>Error</h1><p>Verification data not found.</p></body></html>`,
      { status: 404, headers: { "Content-Type": "text/html" } }
    );
  }
}
