import type { CollectionConfig } from "payload";
import { getBusinessDetailsFromGoogle } from "@/lib/api/utils";

export const Verifications: CollectionConfig = {
  slug: "verifications",
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
    components: {
      Description: "./components/payload/VerificationActions.tsx#default",
    },
  },
  endpoints: [
    {
      path: "/:id/accept",
      method: "post",
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (req.user.collection !== "users") {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        const id = req.routeParams?.id as string;

        let verification;
        try {
          verification = await req.payload.findByID({
            collection: "verifications",
            id,
          });
        } catch {
          return Response.json(
            { error: "Verification not found" },
            { status: 404 },
          );
        }

        // Grant ownership to the requester. verificationEmail can't be used for
        // this: for email-mode requests it holds the business's own address.
        const businessUserId =
          typeof verification.businessUser === "object"
            ? verification.businessUser.id
            : verification.businessUser;

        const grantee = await req.payload
          .findByID({ collection: "businessUsers", id: businessUserId })
          .catch(() => null);

        if (!grantee) {
          return Response.json(
            { error: "The business user who requested this no longer exists" },
            { status: 404 },
          );
        }

        const details = await getBusinessDetailsFromGoogle(
          verification.placeId!,
        );

        if (!details) {
          return Response.json(
            { error: "Failed to fetch business details from Google Places" },
            { status: 503 },
          );
        }

        // Check if a business with this placeId already exists (reactivation case)
        const { docs: existingBusinesses } = await req.payload.find({
          collection: "businesses",
          where: { placeId: { equals: details.placeId } },
          limit: 1,
        });

        let business;
        if (existingBusinesses.length > 0) {
          // Reactivate existing business
          business = await req.payload.update({
            collection: "businesses",
            id: existingBusinesses[0].id,
            data: { inactive: false },
          });
        } else {
          // Create new business
          business = await req.payload.create({
            collection: "businesses",
            data: {
              placeId: details.placeId,
              businessName: details.name,
              address: details.address.address ?? "",
              streetNumber: details.address.streetNumber ?? "",
              city: details.address.city ?? "",
              postalCode: details.address.postalCode ?? "",
              state: details.address.state ?? "",
              country: details.address.country ?? "",
              location: [details.location.lng, details.location.lat],
              inactive: false,
            },
          });
        }

        // Append to the requester's ownedBusinesses
        const currentOwned = ((grantee.ownedBusinesses as any[]) ?? []).map(
          (b: any) => (typeof b === "object" ? b.id : b),
        );
        if (!currentOwned.includes(business.id)) {
          currentOwned.push(business.id);
        }
        const businessUser = await req.payload.update({
          collection: "businessUsers",
          id: grantee.id,
          data: { ownedBusinesses: currentOwned },
        });

        await req.payload.delete({
          collection: "verifications",
          id,
        });

        return Response.json({
          success: true,
          business: business.id,
          businessUser,
        });
      },
    },
    {
      path: "/:id/decline",
      method: "post",
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (req.user.collection !== "users") {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        const id = req.routeParams?.id as string;

        try {
          await req.payload.delete({
            collection: "verifications",
            id,
          });
        } catch {
          return Response.json(
            { error: "Failed to delete verification" },
            { status: 500 },
          );
        }

        return Response.json({ success: true });
      },
    },
  ],
  fields: [
    {
      name: "business",
      type: "relationship",
      relationTo: "businesses",
    },
    {
      name: "placeId",
      type: "text",
      required: true,
      admin: {
        description: "Google Maps place id",
      },
    },
    {
      name: "businessUser",
      type: "relationship",
      relationTo: "businessUsers",
      required: true,
    },
    {
      name: "verificationEmail",
      type: "text",
    },
    {
      name: "verificationPhone",
      type: "text",
    },
    {
      name: "connectionType",
      type: "select",
      required: true,
      defaultValue: "user",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
      ],
    },
    {
      name: "verificationMode",
      type: "select",
      required: true,
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "verificationNotes",
      type: "text",
    },
  ],
};
