import { verifyAuth, verifyBusinessMembership, errorResponse, ApiError } from "@/lib/api/middleware";
import { getPayload } from "payload";
import config from "@payload-config";
import { sendDonationPickedUpEmail } from "@/lib/api/donations";
import { sendNotifications } from "@/lib/api/notifications";
import { NextRequest, NextResponse } from "next/server";

// redeemDonation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ donationId: string }> }
) {
  try {
    const authData = await verifyAuth(request);
    const { donationId } = await params;
    const { businessId, pin } = await request.json();
    const { user } = await verifyBusinessMembership(authData, businessId);

    if (!donationId)
      throw new ApiError(400, "Missing parameter: donationId.");

    if (!pin)
      throw new ApiError(400, "Missing parameter: pin.");

    const payload = await getPayload({ config });

    // Find the reservation for this donation
    const { docs: reservations } = await payload.find({
      collection: "reservations",
      where: { donation: { equals: donationId } },
      limit: 1,
    });

    if (reservations.length === 0)
      throw new ApiError(404, "No active reservation found for this donation.");

    const reservation = reservations[0];

    if (reservation.pin !== pin)
      throw new ApiError(401, "Invalid PIN.");

    // Get the donation with item and business info
    const donation = await payload.findByID({
      collection: "donations",
      id: donationId,
      depth: 2,
    });

    const business = typeof donation.business === "object" ? donation.business : null;

    const donationBusinessId = business ? business.id : donation.business;
    if (String(donationBusinessId) !== String(businessId))
      throw new ApiError(404, "Donation not found at your business.");

    // Redeem the donation
    const redeemed = await payload.update({
      collection: "donations",
      id: donationId,
      data: {
        redeemedBy: user.id,
        redeemedAt: new Date().toISOString(),
      },
    });

    // Delete the reservation
    await payload.delete({
      collection: "reservations",
      id: reservation.id,
    });

    sendNotifications(businessId, "donation_removed", user.id);

    await sendDonationPickedUpEmail(donation);

    return NextResponse.json(redeemed);
  } catch (error) {
    return errorResponse(error);
  }
}
