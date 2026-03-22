import { verifyAuth, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

// changePassword
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword)
      throw new ApiError(400, "Missing currentPassword or newPassword.");

    if (newPassword.length < 8)
      throw new ApiError(400, "New password must be at least 8 characters.");

    const payload = await getPayload({ config });

    // Verify current password by attempting login
    try {
      await payload.login({
        collection: "businessUsers",
        data: { email: authData.email, password: currentPassword },
      });
    } catch {
      throw new ApiError(401, "Current password is incorrect.");
    }

    // Find the user
    const { docs } = await payload.find({
      collection: "businessUsers",
      where: { email: { equals: authData.email } },
      limit: 1,
    });

    if (docs.length === 0)
      throw new ApiError(404, "User not found.");

    // Update password
    await payload.update({
      collection: "businessUsers",
      id: docs[0].id,
      data: { password: newPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
