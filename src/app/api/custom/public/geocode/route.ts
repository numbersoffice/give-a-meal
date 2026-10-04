import { NextRequest, NextResponse } from "next/server";
import { createRateLimiter } from "@/lib/api/rateLimit";

const limiter = createRateLimiter(30, 10 * 60 * 1000);

export async function GET(request: NextRequest) {
  if (limiter.consume(request)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  const address = request.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required." }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY || "";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      return NextResponse.json({
        lat: data.results[0].geometry.location.lat,
        lon: data.results[0].geometry.location.lng,
      });
    } else {
      return NextResponse.json({ error: `Geocoding failed: ${data.status}` }, { status: 400 });
    }
  } catch (error) {
    console.error("Error during geocoding:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
