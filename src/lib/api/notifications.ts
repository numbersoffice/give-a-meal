import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { supabaseService } from "@/lib/supabase";

export type NotificationTypes = "donation_added" | "donation_removed" | "team_request";

export async function sendNotifications(
  businessId: number,
  type: NotificationTypes,
  callerUserId?: number
) {
  if (!businessId || !type) return;

  const expo = new Expo();

  const teamRes = await supabaseService
    .from("profiles")
    .select("*, business_connections!inner(*)")
    .eq("business_connections.business", businessId)
    .not("push_token", "is", null);

  if (teamRes.error) return;

  const messages: ExpoPushMessage[] = [];

  switch (type) {
    case "donation_added":
      for (const profile of teamRes.data) {
        if (!profile.push_token) continue;
        if (profile.id === callerUserId) continue;
        if (!Expo.isExpoPushToken(profile.push_token)) continue;
        messages.push({
          to: profile.push_token,
          title: "Donation added 🎉",
          body: "Someone just donated a meal!",
        });
      }
      break;
    case "donation_removed":
      for (const profile of teamRes.data) {
        if (!profile.push_token) continue;
        if (profile.id === callerUserId) continue;
        if (!Expo.isExpoPushToken(profile.push_token)) continue;
        messages.push({
          to: profile.push_token,
          title: "Donation collected 🥪",
          body: "Someone just picked up a meal!",
        });
      }
      break;
    case "team_request":
      for (const profile of teamRes.data) {
        if (!profile.push_token) continue;
        if (profile.business_connections[0].connection_type !== "admin") continue;
        if (!Expo.isExpoPushToken(profile.push_token)) continue;
        messages.push({
          to: profile.push_token,
          title: "Team request",
          body: "Someone wants to join your team!",
        });
      }
      break;
  }

  expo.sendPushNotificationsAsync(messages);
}
