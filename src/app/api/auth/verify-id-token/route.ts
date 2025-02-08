import { verifySessionCookie } from "@/utils/server/verifySessionCookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session");

    if (session) {
      const dt = await verifySessionCookie(session.value);

      if (!dt || !dt.uid || !dt.email) {
        throw new Error("Unauthorized");
      }

      return NextResponse.json(
        { email: dt.email, uid: dt.uid },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { error: "Couldn't find session" },
      { status: 403 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
