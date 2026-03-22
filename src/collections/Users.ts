import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
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
  labels: {
    singular: "Admin",
    plural: "Admins",
  },
  admin: {
    useAsTitle: "email",
    group: "Auth",
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
