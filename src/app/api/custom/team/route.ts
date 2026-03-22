import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// getTeam
export async function GET(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const businessId = request.nextUrl.searchParams.get("businessId")!;
    await verifyBusinessMembership(authData, businessId, true);

    const payload = await getPayload({ config });

    const { docs } = await payload.find({
      collection: "businessUsers",
      where: {
        or: [
          { ownedBusinesses: { in: [businessId] } },
          { staffBusinesses: { in: [businessId] } },
        ],
      },
      limit: 100,
    });

    // Add role info
    const team = docs.map((member) => {
      const ownedIds = ((member.ownedBusinesses as any[]) ?? []).map((b: any) =>
        typeof b === "object" ? String(b.id) : String(b)
      );
      return {
        ...member,
        connectionType: ownedIds.includes(String(businessId)) ? "admin" : "user",
      };
    });

    return NextResponse.json(team);
  } catch (error) {
    return errorResponse(error);
  }
}
