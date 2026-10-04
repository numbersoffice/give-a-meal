import type { Donation } from "@/payload-types";

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
