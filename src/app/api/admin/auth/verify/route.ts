import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/admin/firebaseAdmin";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("admin-session");

    if (!session) {
      return NextResponse.json({ error: "No session" }, { status: 403 });
    }

    const decoded = await getAdminAuth().verifySessionCookie(
      session.value,
      true
    );

    if (!decoded.uid || !decoded.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(
      { email: decoded.email, uid: decoded.uid },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
