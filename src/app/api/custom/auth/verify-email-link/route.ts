import getProxyOrigin from "@/utils/getProxyOrigin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = getProxyOrigin(request);
  const token = request.nextUrl.searchParams.get("token");
  const lang = request.nextUrl.searchParams.get("lang") || "en";

  if (!token) {
    return NextResponse.redirect(`${origin}/${lang}/donors/login`);
  }

  try {
    // Delegate to the Payload collection endpoint
    const verifyRes = await fetch(`${origin}/api/donors/magic-link/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    if (!verifyRes.ok) {
      return NextResponse.redirect(`${origin}/${lang}/donors/login`);
    }

    const { token: jwt } = await verifyRes.json();

    // Set the JWT as a cookie and redirect to profile
    const response = NextResponse.redirect(
      `${origin}/${lang}/donors/profile`,
    );

    const isDev = process.env.NODE_ENV === "development";
    response.cookies.set({
      name: "payload-token",
      value: jwt,
      httpOnly: true,
      secure: !isDev,
      path: "/",
      maxAge: 60 * 60 * 24 * 14, // 2 weeks
    });

    return response;
  } catch (error) {
    console.error("Magic link verification failed:", error);
    return NextResponse.redirect(`${origin}/${lang}/donors/login`);
  }
}
