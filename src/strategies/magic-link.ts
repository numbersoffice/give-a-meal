import type { AuthStrategy } from "payload";

export const magicLinkStrategy: AuthStrategy = {
  name: "magic-link",
  authenticate: async ({ payload, headers }) => {
    // Extract token from Authorization header or cookie
    const token = headers.get("x-magic-token");
    if (!token) return { user: null };

    // Find donor with matching, unexpired token
    const { docs } = await payload.find({
      collection: "donors",
      where: {
        magicLinkToken: { equals: token },
        magicLinkExpiry: { greater_than: new Date().toISOString() },
      },
      limit: 1,
    });

    if (!docs.length) return { user: null };

    // Clear the token (single-use)
    await payload.update({
      collection: "donors",
      id: docs[0].id,
      data: { magicLinkToken: null, magicLinkExpiry: null } as any,
    });

    return { user: docs[0] };
  },
};
