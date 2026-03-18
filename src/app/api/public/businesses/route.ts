import { supabaseService } from "@/lib/supabase";
import { errorResponse, ApiError } from "@/lib/api/middleware";
import { NextRequest, NextResponse } from "next/server";

// getBusinessesByLocation
export async function GET(request: NextRequest) {
  try {
    const limit = 10;
    const lat = request.nextUrl.searchParams.get("lat");
    const lon = request.nextUrl.searchParams.get("lon");

    if (!lat || !lon)
      throw new ApiError(400, "Latitude and longitude of type string are required.");

    let options: any = {
      latitude: lat,
      longitude: lon,
      row_limit: limit,
    };

    const minLat = request.nextUrl.searchParams.get("minlat");
    const maxLat = request.nextUrl.searchParams.get("maxlat");
    const minLon = request.nextUrl.searchParams.get("minlon");
    const maxLon = request.nextUrl.searchParams.get("maxlon");

    if (minLat) options.min_lat = minLat;
    if (maxLat) options.max_lat = maxLat;
    if (minLon) options.min_lon = minLon;
    if (maxLon) options.max_lon = maxLon;

    const businesses = await supabaseService.rpc("get_nearest_businesses", options);

    if (businesses.error)
      throw new ApiError(500, "Failed to fetch business details.");

    return NextResponse.json(businesses.data);
  } catch (error) {
    return errorResponse(error);
  }
}
