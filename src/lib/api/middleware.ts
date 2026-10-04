import { APIError, getPayload } from "payload";
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

  if (result.user?.collection === "businessUsers") {
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
      id: { equals: authData.uid },
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
  // Payload marks errors that are safe to show (validation, not found, …) as
  // public. Anything else may carry database internals, so only log it.
  if (error instanceof APIError && error.isPublic) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
