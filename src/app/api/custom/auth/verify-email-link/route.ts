import getProxyOrigin from "@/utils/getProxyOrigin";
import { verifyMagicLinkToken } from "@/lib/auth/magicLink";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const origin = getProxyOrigin(request);
  const token = request.nextUrl.searchParams.get("token");
  const lang = request.nextUrl.searchParams.get("lang") || "en";

  if (!token) {
    return NextResponse.redirect(`${origin}/${lang}/donors/login`);
  }

  try {
    const payload = await getPayload({ config });
    const loginResult = await verifyMagicLinkToken(payload, token);

    if (!loginResult?.token) {
      return NextResponse.redirect(`${origin}/${lang}/donors/login`);
    }

    const jwt = loginResult.token;

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
