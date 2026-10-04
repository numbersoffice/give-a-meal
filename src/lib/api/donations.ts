import { getPayload } from "payload";
import config from "@payload-config";
import type { Donation } from "@/payload-types";
import donationClaimedTemplate from "@/components/emailTemplates/donationClaimed";

const idOnly = (value: Donation["createdBy"]) =>
  value && typeof value === "object" ? { id: value.id } : value;

/**
 * Strips personal data (emails, push tokens, owned businesses) from a populated
 * donation before it is returned to an unauthenticated caller.
 *
 * The response keeps the same shape: `createdBy`/`redeemedBy` stay objects with
 * an `id` and `donatedBy` keeps `firstName`, because already-installed app
 * versions read those paths and would crash if they were removed.
 */
export function toPublicDonation<T extends Donation>(donation: T) {
  const { donatedBy } = donation;
  return {
    ...donation,
    createdBy: idOnly(donation.createdBy),
    redeemedBy: idOnly(donation.redeemedBy),
    donatedBy:
      donatedBy && typeof donatedBy === "object"
        ? { id: donatedBy.id, firstName: donatedBy.firstName ?? null }
        : donatedBy,
  };
}

/**
 * Reservations made over SMS store the claimant's phone number (E.164, e.g.
 * "+15551234567") as `deviceId`; the app always uses a random uuid. Public
 * endpoints keyed on a device id must refuse phone numbers, otherwise anyone who
 * knows a number could read its PINs or claim meals in its name.
 */
export const isPhoneDeviceId = (deviceId: string) => deviceId.startsWith("+");

/**
 * Emails the donor that their donation was picked up. Best effort, never throws.
 * Expects `item` and `business` to be populated.
 *
 * Only `donatedBy` identifies the donor. Older donations that only have the
 * deprecated `donorName` get no email: it's a free-text first name, and looking
 * donors up by it emailed whoever happened to share that name.
 */
export async function sendDonationPickedUpEmail(donation: Donation) {
  try {
    const item = typeof donation.item === "object" ? donation.item : null;
    const business =
      typeof donation.business === "object" ? donation.business : null;
    if (!item || !donation.donatedBy) return;

    const payload = await getPayload({ config });
    const donor =
      typeof donation.donatedBy === "object"
        ? donation.donatedBy
        : await payload.findByID({ collection: "donors", id: donation.donatedBy });
    if (!donor?.email) return;

    const template = donationClaimedTemplate({
      businessName: business?.businessName ?? "",
      donationName: item.title ?? "",
      donorProfileUrl: `https://give-a-meal.org/donors/profile?pe=${donor.email}`,
    });
    await payload.sendEmail({
      to: donor.email,
      subject: "Somebody has picked up your donation!",
      text: template.text,
      html: template.html,
    });
  } catch (err) {
    console.log(err);
  }
}
