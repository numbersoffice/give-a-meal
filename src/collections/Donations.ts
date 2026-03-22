import type { CollectionConfig } from "payload";

export const Donations: CollectionConfig = {
  slug: "donations",
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
  fields: [
    {
      name: "item",
      type: "relationship",
      relationTo: "items",
      required: true,
    },
    {
      name: "business",
      type: "relationship",
      relationTo: "businesses",
      required: true,
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "businessUsers",
      admin: {
        description:
          "The staff member who has submitted this donation to the system.",
      },
    },
    {
      name: "redeemedBy",
      type: "relationship",
      relationTo: "businessUsers",
      admin: {
        description: "The staff member who has handed this donation out.",
      },
    },
    {
      name: "donorName",
      type: "text",
      admin: {
        description: "[DEPRECATED] Use donatedBy instead",
      },
    },
    {
      name: "donatedBy",
      type: "relationship",
      relationTo: "donors",
    },
    {
      name: "redeemedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
  ],
};
