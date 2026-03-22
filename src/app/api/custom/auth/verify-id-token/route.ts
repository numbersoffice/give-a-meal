import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const result = await payload.auth({ headers: request.headers });

    if (result.user) {
      return NextResponse.json(
        { email: result.user.email, id: result.user.id },
        { status: 200 },
      );
    }

    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 403 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
