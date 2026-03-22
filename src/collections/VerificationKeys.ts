import type { CollectionConfig } from "payload";

export const VerificationKeys: CollectionConfig = {
  slug: "verification-keys",
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
  },
  admin: {
    group: "System",
  },
  fields: [
    {
      name: "verification",
      type: "relationship",
      relationTo: "verifications",
      required: true,
    },
    {
      name: "key",
      type: "text",
      required: true,
    },
  ],
};
