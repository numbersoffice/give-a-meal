import { magicLinkStrategy } from "@/strategies/magic-link";
import type { CollectionConfig } from "payload";
import crypto from "crypto";

export const Donors: CollectionConfig = {
  slug: "donors",
  access: {
    read: ({ req }) => {
      return req.user?.collection === "users";
    },
    update: ({ req }) => {
      return req.user?.collection === "users";
    },
    create: ({ req }) => {
      return req.user?.collection === "users";
    },
    delete: ({ req }) => {
      return req.user?.collection === "users";
    },
    admin: () => false,
  },
  admin: {
    useAsTitle: "email",
    group: "Auth",
  },
  auth: {
    strategies: [magicLinkStrategy],
  },
  fields: [
    {
      name: "email",
      type: "text",
      required: true,
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "pushToken",
      type: "text",
    },
    { name: "magicLinkToken", type: "text", hidden: true },
    { name: "magicLinkExpiry", type: "date", hidden: true },
  ],
  endpoints: [
    {
      path: "/magic-link/request",
      method: "post",
      handler: async (req) => {
        const { email, lang } =
          typeof req.json === "function" ? await req.json() : {};
        const { docs } = await req.payload.find({
          collection: "donors",
          where: { email: { equals: email } },
          limit: 1,
        });

        // If no donor exists, create one — then proceed with the magic link flow
        let donor = docs[0];
        if (!donor) {
          donor = await req.payload.create({
            collection: "donors",
            data: { email, password: crypto.randomBytes(32).toString("hex") },
          });
        }

        const token = crypto.randomBytes(32).toString("hex");
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

        await req.payload.update({
          collection: "donors",
          id: donor.id,
          data: { magicLinkToken: token, magicLinkExpiry: expiry } as any,
        });

        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        await req.payload.sendEmail({
          to: email,
          subject: "Your login link",
          html: `<a href="${baseUrl}/api/custom/auth/verify-email-link?token=${token}&lang=${lang || "en"}">Log in</a>`,
        });

        return Response.json({ ok: true });
      },
    },
    {
      path: "/magic-link/verify",
      method: "post",
      handler: async (req) => {
        const { token } =
          typeof req.json === "function" ? await req.json() : {};

        const { docs } = await req.payload.find({
          collection: "donors",
          where: {
            magicLinkToken: { equals: token },
            magicLinkExpiry: { greater_than: new Date().toISOString() },
          },
          limit: 1,
        });

        if (!docs.length) {
          return Response.json(
            { error: "Invalid or expired token" },
            { status: 400 },
          );
        }

        const user = docs[0];
        const tempPassword = crypto.randomBytes(32).toString("hex");

        // Set a temporary password, login with it, then randomize it again
        await req.payload.update({
          collection: "donors",
          id: user.id,
          data: {
            password: tempPassword,
            magicLinkToken: null,
            magicLinkExpiry: null,
          } as any,
        });

        const loginResult = await req.payload.login({
          collection: "donors",
          data: { email: user.email, password: tempPassword },
          req,
        });

        // Scramble password so it can't be reused
        await req.payload.update({
          collection: "donors",
          id: user.id,
          data: { password: crypto.randomBytes(32).toString("hex") } as any,
        });

        return Response.json({
          token: loginResult.token,
          exp: loginResult.exp,
          user: loginResult.user,
        });
      },
    },
  ],
};
