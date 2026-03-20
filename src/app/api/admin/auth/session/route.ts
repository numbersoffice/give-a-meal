import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/admin/firebaseAdmin";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    const expiresIn = 14 * 24 * 60 * 60 * 1000; // 2 weeks
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn,
    });

    const isDev = process.env.NODE_ENV === "development";
    (await cookies()).set({
      name: "admin-session",
      value: sessionCookie,
      maxAge: expiresIn,
      httpOnly: true,
      secure: !isDev,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete("admin-session");
  return NextResponse.json({ success: true });
}
