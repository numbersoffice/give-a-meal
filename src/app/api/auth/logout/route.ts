import { NextRequest, NextResponse } from "next/server";
import { initAdminApp } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";

initAdminApp();

export async function GET(request: NextRequest) {
  // SYSTEM
  // Get host from header for use behind a reverse proxy.
  // Nextjs does not use it by default
  const host = request.headers.get("host");
  if (!host) return NextResponse.next();

  const session = cookies().get("session");
  const lang = request.nextUrl.searchParams.get("lang");

  if (session) {
    try {
      const response = NextResponse.redirect(new URL(`/${lang}`, host));
      response.cookies.delete("session");
      return response;
    } catch (error: any) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }
  } else {
    const response = NextResponse.redirect(new URL(`/${lang}`, host));
    response.cookies.delete("session");
    return response;
  }
}
