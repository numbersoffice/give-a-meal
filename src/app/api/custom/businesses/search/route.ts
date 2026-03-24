import { errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// listBusinesses
export async function GET(request: NextRequest) {
  try {
    const businessName = request.nextUrl.searchParams.get("businessName");
    const lat = request.nextUrl.searchParams.get("lat");
    const lon = request.nextUrl.searchParams.get("lon");

    if (!businessName || typeof businessName !== "string")
      throw new ApiError(400, "Business name needs to be a string.");

    const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const searchQuery = "?query=" + encodeURIComponent(businessName);
    const apiKeyQuery = "&key=" + mapsApiKey;
    const locationQuery = lat && lon ? "&location=" + encodeURIComponent(`${lat},${lon}`) : "";
    const radiusQuery = locationQuery.length > 0 ? "&radius=1000" : "";

    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json${searchQuery}${locationQuery}${radiusQuery}${apiKeyQuery}`;
    const response = await fetch(url);
    const googlePlaces: any = await response.json();

    const placeIds: string[] = googlePlaces.results.map(
      (place: any) => place.place_id
    );

    const payload = await getPayload({ config });

    const { docs: businesses } = await payload.find({
      collection: "businesses",
      where: { placeId: { in: placeIds } },
      limit: placeIds.length,
    });

    const places = googlePlaces.results.map((place: any) => ({
      placeId: place.place_id,
      name: place.name,
      formattedAddress: place.formatted_address,
      business: businesses.find((b) => b.placeId === place.place_id) ?? null,
    }));

    return NextResponse.json(places);
  } catch (error) {
    return errorResponse(error);
  }
}
