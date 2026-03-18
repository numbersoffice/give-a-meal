import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { supabaseService } from "@/lib/supabase";
import { getBusinessDetailsFromGoogle, keysToCamel } from "@/lib/api/utils";
import { NextRequest, NextResponse } from "next/server";

// getUserStatus
export async function GET(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);

    // Check for user profile and associated business
    const connection: any = await supabaseService
      .from("business_connections")
      .select("*, business!inner(*), profile!inner(*)")
      .eq("profile.auth_id", authData.uid)
      .limit(1)
      .single();

    if (connection.data) {
      return NextResponse.json({
        verificationStatus: "full",
        business: keysToCamel(connection.data.business),
        profile: keysToCamel(connection.data.profile),
        verification: {
          verificationMode: null,
          connectionType: connection.data.connection_type,
        },
      });
    }

    // Check for active verification
    const verification: any = await supabaseService
      .from("verifications")
      .select("*, business!left(*)")
      .eq("auth_id", authData.uid)
      .limit(1)
      .single();

    if (verification.data) {
      const {
        verification_mode: verificationMode,
        connection_type: connectionType,
        ...rest
      } = verification.data;

      if (verification.data.business) {
        return NextResponse.json({
          verificationStatus: "verificationPending",
          business: keysToCamel(verification.data.business) ?? null,
          profile: null,
          verification: {
            verificationMode,
            connectionType,
            ...keysToCamel(rest),
          },
        });
      } else {
        const details = await getBusinessDetailsFromGoogle(verification.data.place_id);
        if (!details)
          throw new ApiError(500, "Failed to load user info");

        return NextResponse.json({
          verificationStatus: "verificationPending",
          verification: {
            verificationMode,
            connectionType,
            ...keysToCamel(rest),
          },
          business: {
            id: null,
            placeId: verification.data.place_id,
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
      verificationStatus: "new",
      business: null,
      profile: null,
      verification: { verificationMode: null, connectionType: null },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
