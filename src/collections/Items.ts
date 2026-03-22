import type { CollectionConfig } from "payload";

export const Items: CollectionConfig = {
  slug: "items",
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
    useAsTitle: "title",
  },
  fields: [
    {
      name: "business",
      type: "relationship",
      relationTo: "businesses",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "title",
      type: "text",
    },
    {
      name: "description",
      type: "text",
    },
    {
      name: "archived",
      type: "checkbox",
      defaultValue: false,
      required: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
