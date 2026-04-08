import type { CollectionConfig } from "payload";

export const Businesses: CollectionConfig = {
  slug: "businesses",
  admin: {
    useAsTitle: "businessName",
  },
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
      name: "placeId",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "businessName",
      type: "text",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "email",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "website",
      type: "text",
      admin: {
        position: "sidebar",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "address",
          type: "text",
        },
        {
          name: "streetNumber",
          type: "text",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "city",
          type: "text",
        },
        {
          name: "postalCode",
          type: "text",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "state",
          type: "text",
        },
        {
          name: "country",
          type: "text",
        },
      ],
    },
    {
      name: "location",
      type: "point",
      required: true,
    },
    {
      name: "inactive",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "trusted",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description:
          "Trusted business receive special permissions e.g. directly redeeming donations without inputting a pin.",
      },
    },
  ],
};
