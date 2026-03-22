import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";

export type AuthData = {
  uid: string;
  email: string;
  connectionData?: any;
};

export async function verifyAuth(request: NextRequest): Promise<AuthData> {
  const payload = await getPayload({ config });

  const headers = request.headers;
  const result = await payload.auth({ headers });

  if (result.user) {
    return { uid: result.user.id, email: result.user.email };
  } else {
    throw new ApiError(401, "Invalid token.");
  }
}

export async function verifyBusinessMembership(
  authData: AuthData,
  businessId: number | string,
  adminOnly = false,
): Promise<{ user: any; role: "owner" | "staff" }> {
  if (!businessId) {
    throw new ApiError(400, "Business ID is required.");
  }

  const payload = await getPayload({ config });

  const { docs } = await payload.find({
    collection: "businessUsers",
    where: {
      email: { equals: authData.email },
      or: [
        { ownedBusinesses: { in: [businessId] } },
        { staffBusinesses: { in: [businessId] } },
      ],
    },
    limit: 1,
  });

  if (docs.length === 0) {
    throw new ApiError(403, "User does not belong to the specified business.");
  }

  const user = docs[0];
  const ownedIds = ((user.ownedBusinesses as any[]) ?? []).map((b: any) =>
    typeof b === "object" ? b.id : b,
  );
  const role =
    ownedIds.includes(
      typeof businessId === "string" ? businessId : String(businessId),
    ) || ownedIds.includes(businessId)
      ? "owner"
      : "staff";

  if (adminOnly && role !== "owner") {
    throw new ApiError(
      403,
      "This operation can only be performed by an admin.",
    );
  }

  return { user, role };
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }
  const message =
    error instanceof Error ? error.message : "Internal server error";
  return NextResponse.json({ error: message }, { status: 500 });
}
