import { initAdminApp } from "@/lib/firebaseAdmin";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getProxyOrigin from "@/utils/getProxyOrigin";

// Init the Firebase SDK every time the server is called
initAdminApp();

export async function GET(request: NextRequest) {
  const options = {
    name: "Hello World",
    value: new Date().getMilliseconds().toString(),
    maxAge: 100000000,
    // httpOnly: true,
    // secure: isDev ? false : true,
  };

  cookies().set(options);

  // return NextResponse.redirect(`${origin}/${lang}/donors/login`);
  return NextResponse.redirect(getProxyOrigin(request));
}
