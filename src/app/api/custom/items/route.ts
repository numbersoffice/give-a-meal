import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// getItemsFromBusiness
export async function GET(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const businessId = request.nextUrl.searchParams.get("businessId")!;
    await verifyBusinessMembership(authData, businessId);

    const payload = await getPayload({ config });

    const { docs: items } = await payload.find({
      collection: "items",
      where: {
        business: { equals: businessId },
        archived: { equals: false },
      },
      sort: "title",
      limit: 100,
    });

    // Get donation counts for each item
    const itemsWithCounts = await Promise.all(
      items.map(async (item) => {
        const { totalDocs } = await payload.count({
          collection: "donations",
          where: {
            item: { equals: item.id },
            redeemedAt: { exists: false },
          },
        });
        return { ...item, donationCount: totalDocs };
      })
    );

    return NextResponse.json(itemsWithCounts);
  } catch (error) {
    return errorResponse(error);
  }
}

// createItem
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { businessId, title, description } = await request.json();
    await verifyBusinessMembership(authData, businessId);

    if (!title || typeof title !== "string")
      throw new ApiError(400, "Missing parameter or wrong type: title.");
    if (!description || typeof description !== "string")
      throw new ApiError(400, "Missing parameter or wrong type: description.");

    const payload = await getPayload({ config });

    // Check for duplicate
    const { docs: duplicates } = await payload.find({
      collection: "items",
      where: {
        title: { equals: title },
        business: { equals: businessId },
        archived: { equals: false },
      },
      limit: 1,
    });

    if (duplicates.length > 0)
      throw new ApiError(400, `Item with name ${title} already exists.`);

    const item = await payload.create({
      collection: "items",
      data: {
        business: businessId,
        title,
        description,
        archived: false,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return errorResponse(error);
  }
}
