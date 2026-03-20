import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, unauthorizedResponse, errorResponse } from "@/lib/admin/auth";
import { supabaseService } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    await verifyAdminAuth(req);
  } catch {
    return unauthorizedResponse();
  }

  const [
    businessCount,
    verificationCount,
    profileCount,
    donationCount,
    itemCount,
  ] = await Promise.all([
    supabaseService.from("businesses").select("*", { count: "exact", head: true }),
    supabaseService.from("verifications").select("*", { count: "exact", head: true }),
    supabaseService.from("profiles").select("*", { count: "exact", head: true }),
    supabaseService.from("donations").select("*", { count: "exact", head: true }),
    supabaseService.from("items").select("*", { count: "exact", head: true }),
  ]);

  const error =
    businessCount.error ||
    verificationCount.error ||
    profileCount.error ||
    donationCount.error ||
    itemCount.error;

  if (error) {
    return errorResponse("Error fetching counts");
  }

  return NextResponse.json([
    { title: "Businesses", count: businessCount.count },
    { title: "Verifications", count: verificationCount.count },
    { title: "Profiles", count: profileCount.count },
    { title: "Donations", count: donationCount.count },
    { title: "Items", count: itemCount.count },
  ]);
}
