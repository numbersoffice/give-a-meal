import { getPayload } from "payload";
import config from "@payload-config";
import type { Tool } from "@anthropic-ai/sdk/resources/messages";

// --- Claude tool definitions ---

export const smsTools: Tool[] = [
  {
    name: "find_nearby_restaurants",
    description:
      "Find restaurants near a location that have available donated meals. Call this when the user provides a location (address, city, neighborhood, landmark, etc.).",
    input_schema: {
      type: "object" as const,
      properties: {
        location: {
          type: "string",
          description:
            "The location to search near, as provided by the user (e.g. 'downtown Seattle', '123 Main St, Portland, OR').",
        },
      },
      required: ["location"],
    },
  },
  {
    name: "get_restaurant_meals",
    description:
      "Get the list of available meals at a specific restaurant. Call this when the user picks a restaurant from the list.",
    input_schema: {
      type: "object" as const,
      properties: {
        businessId: {
          type: "string",
          description: "The ID of the business/restaurant.",
        },
      },
      required: ["businessId"],
    },
  },
  {
    name: "claim_meal",
    description:
      "Claim/reserve a specific meal for the user. This generates a 6-digit PIN they present at the restaurant. Call this when the user picks a meal from the list.",
    input_schema: {
      type: "object" as const,
      properties: {
        donationId: {
          type: "string",
          description: "The ID of the donation to claim.",
        },
      },
      required: ["donationId"],
    },
  },
];

// --- Tool executors ---

export async function executeToolCall(
  toolName: string,
  toolInput: Record<string, string>,
  phoneNumber: string,
): Promise<string> {
  switch (toolName) {
    case "find_nearby_restaurants":
      return findNearbyRestaurants(toolInput.location);
    case "get_restaurant_meals":
      return getRestaurantMeals(toolInput.businessId);
    case "claim_meal":
      return claimMeal(toolInput.donationId, phoneNumber);
    default:
      return JSON.stringify({ error: "Unknown tool" });
  }
}

async function geocodeLocation(
  address: string,
): Promise<{ lat: number; lon: number } | null> {
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY || "";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK" && data.results.length > 0) {
    return {
      lat: data.results[0].geometry.location.lat,
      lon: data.results[0].geometry.location.lng,
    };
  }
  return null;
}

async function findNearbyRestaurants(location: string): Promise<string> {
  const coords = await geocodeLocation(location);
  if (!coords) {
    return JSON.stringify({
      error: "Could not find that location. Please try a more specific address.",
    });
  }

  const payload = await getPayload({ config });
  const maxDistance = 10000; // 10km radius

  const { docs: businesses } = await payload.find({
    collection: "businesses",
    where: {
      inactive: { equals: false },
      location: { near: `${coords.lon},${coords.lat},${maxDistance},0` },
    },
    limit: 10,
  });

  if (businesses.length === 0) {
    return JSON.stringify({
      restaurants: [],
      message: "No restaurants found near this location.",
    });
  }

  // Count available (unredeemed, unreserved) donations per business
  const results = await Promise.all(
    businesses.map(async (b) => {
      const { docs: donations } = await payload.find({
        collection: "donations",
        where: {
          business: { equals: b.id },
          redeemedAt: { exists: false },
        },
        limit: 100,
      });

      if (donations.length === 0) {
        return { id: b.id, name: b.address, availableMeals: 0 };
      }

      const donationIds = donations.map((d) => d.id);
      const { totalDocs: reservedCount } = await payload.count({
        collection: "reservations",
        where: { donation: { in: donationIds.join(",") } },
      });

      return {
        id: b.id,
        name: b.address,
        availableMeals: donations.length - reservedCount,
      };
    }),
  );

  const withMeals = results.filter((r) => r.availableMeals > 0);

  if (withMeals.length === 0) {
    return JSON.stringify({
      restaurants: [],
      message:
        "Found restaurants nearby but none have available meals right now.",
    });
  }

  return JSON.stringify({ restaurants: withMeals });
}

async function getRestaurantMeals(businessId: string): Promise<string> {
  const payload = await getPayload({ config });

  const { docs: donations } = await payload.find({
    collection: "donations",
    where: {
      business: { equals: businessId },
      redeemedAt: { exists: false },
    },
    limit: 20,
    depth: 1, // populate item relationship
  });

  if (donations.length === 0) {
    return JSON.stringify({
      meals: [],
      message: "No meals are currently available at this restaurant.",
    });
  }

  // Filter out reserved donations
  const donationIds = donations.map((d) => d.id);
  const { docs: reservations } = await payload.find({
    collection: "reservations",
    where: { donation: { in: donationIds.join(",") } },
    limit: 100,
  });
  const reservedIds = new Set(
    reservations.map((r) =>
      typeof r.donation === "object" ? r.donation.id : r.donation,
    ),
  );

  const available = donations
    .filter((d) => !reservedIds.has(d.id))
    .map((d) => {
      const item = d.item as any;
      return {
        donationId: d.id,
        title: item?.title || "Meal",
        description: item?.description || "",
      };
    });

  if (available.length === 0) {
    return JSON.stringify({
      meals: [],
      message: "All meals at this restaurant are currently reserved.",
    });
  }

  return JSON.stringify({ meals: available });
}

function generatePin(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function claimMeal(
  donationId: string,
  phoneNumber: string,
): Promise<string> {
  const payload = await getPayload({ config });
  const maxClaims = 3;

  // Check max claims for this phone number
  const { totalDocs } = await payload.count({
    collection: "reservations",
    where: { deviceId: { equals: phoneNumber } },
  });

  if (totalDocs >= maxClaims) {
    return JSON.stringify({
      error: `You already have ${maxClaims} active reservations. Please pick up or wait for one to expire before claiming another.`,
    });
  }

  // Check donation exists
  let donation;
  try {
    donation = await payload.findByID({
      collection: "donations",
      id: donationId,
      depth: 1,
    });
  } catch {
    return JSON.stringify({ error: "This meal is no longer available." });
  }

  // Check not already reserved
  const { totalDocs: existingReservations } = await payload.count({
    collection: "reservations",
    where: { donation: { equals: donationId } },
  });

  if (existingReservations > 0) {
    return JSON.stringify({
      error: "This meal has already been claimed by someone else.",
    });
  }

  // Check not redeemed
  if (donation.redeemedAt) {
    return JSON.stringify({
      error: "This meal has already been picked up.",
    });
  }

  const pin = generatePin();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await payload.create({
    collection: "reservations",
    data: {
      donation: donationId,
      deviceId: phoneNumber,
      pin,
      expiresAt,
    },
  });

  const business = donation.business as any;
  const businessName = business?.address || "the restaurant";

  return JSON.stringify({
    success: true,
    pin,
    businessName,
    expiresIn: "1 hour",
  });
}
