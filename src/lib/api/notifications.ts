import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { getPayload } from "payload";
import config from "@payload-config";

export type NotificationTypes = "donation_added" | "donation_removed" | "team_request";

export async function sendNotifications(
  businessId: number | string,
  type: NotificationTypes,
  callerUserId?: number | string
) {
  if (!businessId || !type) return;

  const payload = await getPayload({ config });
  const expo = new Expo();

  const { docs: teamMembers } = await payload.find({
    collection: "businessUsers",
    where: {
      or: [
        { ownedBusinesses: { in: [businessId] } },
        { staffBusinesses: { in: [businessId] } },
      ],
      pushToken: { exists: true },
    },
    limit: 100,
  });

  const messages: ExpoPushMessage[] = [];

  for (const member of teamMembers) {
    if (!member.pushToken) continue;
    if (String(member.id) === String(callerUserId)) continue;
    if (!Expo.isExpoPushToken(member.pushToken)) continue;

    const ownedIds = ((member.ownedBusinesses as any[]) ?? []).map((b: any) =>
      typeof b === "object" ? String(b.id) : String(b)
    );
    const isOwner = ownedIds.includes(String(businessId));

    switch (type) {
      case "donation_added":
        messages.push({
          to: member.pushToken,
          title: "Donation added 🎉",
          body: "Someone just donated a meal!",
        });
        break;
      case "donation_removed":
        messages.push({
          to: member.pushToken,
          title: "Donation collected 🥪",
          body: "Someone just picked up a meal!",
        });
        break;
      case "team_request":
        if (isOwner) {
          messages.push({
            to: member.pushToken,
            title: "Team request",
            body: "Someone wants to join your team!",
          });
        }
        break;
    }
  }

  if (messages.length > 0) {
    expo.sendPushNotificationsAsync(messages);
  }
}
