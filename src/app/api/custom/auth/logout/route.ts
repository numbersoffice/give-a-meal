import { NextRequest, NextResponse } from "next/server";
import getProxyOrigin from "@/utils/getProxyOrigin";

export async function GET(request: NextRequest) {
  const origin = getProxyOrigin(request);
  const lang = request.nextUrl.searchParams.get("lang") || "en";

  const response = NextResponse.redirect(new URL(`/${lang}`, origin));
  response.cookies.delete("payload-token");
  return response;
}
