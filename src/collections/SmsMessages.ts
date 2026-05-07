import type { CollectionConfig } from "payload";

export const SmsMessages: CollectionConfig = {
  slug: "sms-messages",
  access: {
    read: ({ req }) => req.user?.collection === "users",
    update: ({ req }) => req.user?.collection === "users",
    create: ({ req }) => req.user?.collection === "users",
    delete: ({ req }) => req.user?.collection === "users",
  },
  admin: {
    useAsTitle: "phoneNumber",
  },
  fields: [
    {
      name: "phoneNumber",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      options: [
        { label: "User", value: "user" },
        { label: "Assistant", value: "assistant" },
      ],
    },
    {
      name: "content",
      type: "textarea",
      required: true,
    },
    {
      name: "expiresAt",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
  ],
};
