import { errorResponse } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";

// getRecentDonationsAndBusinesses
export async function GET() {
  try {
    const payload = await getPayload({ config });

    const [donationsRes, businessesRes] = await Promise.all([
      payload.find({
        collection: "donations",
        sort: "-createdAt",
        limit: 5,
        depth: 2,
      }),
      payload.find({
        collection: "businesses",
        sort: "-createdAt",
        limit: 5,
      }),
    ]);

    return NextResponse.json({
      donations: donationsRes.docs,
      businesses: businessesRes.docs,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
