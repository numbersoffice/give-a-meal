import { supabaseService } from "@/lib/supabase";
import { getBusinessDetailsFromGoogle } from "@/lib/api/utils";
import { initAdminApp } from "@/lib/firebaseAdmin";
import { auth } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

initAdminApp();

// verifyOwnerByEmailLink
export async function GET(request: NextRequest) {
  const verificationKey = request.nextUrl.searchParams.get("key");
  if (!verificationKey) {
    return new NextResponse(
      `<html><body><h1>Error</h1><p>Key missing.</p></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  // Check if verification key exists in database
  const dbEntry: any = await supabaseService
    .from("verification_keys")
    .select("*,verification(*)")
    .eq("key", verificationKey)
    .eq("verification.connection_type", "admin")
    .limit(1)
    .single();

  if (dbEntry.error) {
    return new NextResponse(
      `<html><body><h1>Error</h1><p>This verification link has expired.</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  if (dbEntry.data) {
    const businessDetails = await getBusinessDetailsFromGoogle(
      dbEntry.data.verification.place_id
    );
    if (!businessDetails) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>Failed to fetch business details.</p></body></html>`,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    const user = await auth().getUser(dbEntry.data.verification.auth_id);
    if (!user) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>Failed to fetch auth details.</p></body></html>`,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    // Insert business entry
    const businessRes = await supabaseService
      .from("businesses")
      .insert({
        place_id: dbEntry.data.verification.place_id,
        business_name: businessDetails.name,
        address: businessDetails.address.address,
        street_number: businessDetails.address.streetNumber,
        city: businessDetails.address.city,
        postal_code: businessDetails.address.postalCode,
        state: businessDetails.address.state,
        country: businessDetails.address.country,
        lat: businessDetails.location.lat,
        lon: businessDetails.location.lng,
      })
      .select()
      .limit(1)
      .single();

    if (!businessRes.data || businessRes.error) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>Failed to insert business entry.</p></body></html>`,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    // Insert/upsert profile entry
    const profileRes = await supabaseService
      .from("profiles")
      .upsert(
        { auth_id: dbEntry.data.verification.auth_id, email: user.email },
        { onConflict: "email" }
      )
      .select()
      .limit(1)
      .single();

    if (!profileRes.data || profileRes.error) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>Failed to insert profile entry.</p></body></html>`,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    // Create connection
    const connectionsRes = await supabaseService
      .from("business_connections")
      .insert({
        connection_type: "admin",
        business: businessRes.data.id,
        profile: profileRes.data.id,
      });

    if (connectionsRes.error) {
      return new NextResponse(
        `<html><body><h1>Error</h1><p>${connectionsRes.error.message}</p></body></html>`,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    // Clean up verification key and entry
    await supabaseService
      .from("verification_keys")
      .delete()
      .eq("id", dbEntry.data.id);

    await supabaseService
      .from("verifications")
      .delete()
      .eq("id", dbEntry.data.verification.id);

    return new NextResponse(
      `<html><body><h1>Verification successful</h1><p>You can now leave this site and return to the app.</p></body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  return new NextResponse(
    `<html><body><h1>Error</h1><p>Verification data not found.</p></body></html>`,
    { status: 404, headers: { "Content-Type": "text/html" } }
  );
}
