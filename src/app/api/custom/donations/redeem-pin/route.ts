import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { sendDonationPickedUpEmail } from "@/lib/api/donations";
import { sendNotifications } from "@/lib/api/notifications";
import { NextRequest, NextResponse } from "next/server";

// redeemDonationByPin
export async function POST(request: NextRequest) {
  try {
    const authData = await verifyAuth(request);
    const { businessId, pin } = await request.json();
    const { user } = await verifyBusinessMembership(authData, businessId);

    if (!pin || typeof pin !== "string" || pin.length !== 6)
      throw new ApiError(400, "Invalid PIN. Please enter a 6-digit code.");

    const payload = await getPayload({ config });

    // Find reservation by PIN
    const { docs: reservations } = await payload.find({
      collection: "reservations",
      where: { pin: { equals: pin } },
      depth: 0,
      limit: 10,
    });

    if (reservations.length === 0)
      throw new ApiError(404, "No reservation found for this PIN.");

    // Find the reservation whose donation belongs to this business
    let matchedReservation = null;
    let matchedDonation = null;

    for (const reservation of reservations) {
      const donationId =
        typeof reservation.donation === "object"
          ? reservation.donation.id
          : reservation.donation;

      const donation = await payload.findByID({
        collection: "donations",
        id: donationId,
        depth: 2,
      });

      const donationBusinessId =
        typeof donation.business === "object"
          ? donation.business.id
          : donation.business;

      if (String(donationBusinessId) === String(businessId)) {
        matchedReservation = reservation;
        matchedDonation = donation;
        break;
      }
    }

    if (!matchedReservation || !matchedDonation)
      throw new ApiError(404, "No reservation found for this PIN at your business.");

    const item =
      typeof matchedDonation.item === "object" ? matchedDonation.item : null;

    // Redeem the donation
    const redeemed = await payload.update({
      collection: "donations",
      id: matchedDonation.id,
      data: {
        redeemedBy: user.id,
        redeemedAt: new Date().toISOString(),
      },
    });

    // Delete the reservation
    await payload.delete({
      collection: "reservations",
      id: matchedReservation.id,
    });

    sendNotifications(businessId, "donation_removed", user.id);

    await sendDonationPickedUpEmail(matchedDonation);

    return NextResponse.json({ ...redeemed, itemTitle: item?.title ?? null });
  } catch (error) {
    return errorResponse(error);
  }
}
