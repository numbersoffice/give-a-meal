import type { Payload, PayloadRequest } from "payload";
import crypto from "crypto";

/**
 * Exchanges a donor magic-link token for a Payload login.
 * Returns null when the token is missing, invalid or expired.
 */
export async function verifyMagicLinkToken(
  payload: Payload,
  token: unknown,
  req?: PayloadRequest,
) {
  if (!token || typeof token !== "string") return null;

  const { docs } = await payload.find({
    collection: "donors",
    where: {
      magicLinkToken: { equals: token },
      magicLinkExpiry: { greater_than: new Date().toISOString() },
    },
    limit: 1,
  });

  if (!docs.length) return null;

  const user = docs[0];
  const tempPassword = crypto.randomBytes(32).toString("hex");

  // Set a temporary password, login with it, then randomize it again
  await payload.update({
    collection: "donors",
    id: user.id,
    data: {
      password: tempPassword,
      magicLinkToken: null,
      magicLinkExpiry: null,
    } as any,
  });

  const loginResult = await payload.login({
    collection: "donors",
    data: { email: user.email, password: tempPassword },
    req,
  });

  // Scramble password so it can't be reused
  await payload.update({
    collection: "donors",
    id: user.id,
    data: { password: crypto.randomBytes(32).toString("hex") } as any,
  });

  return loginResult;
}
