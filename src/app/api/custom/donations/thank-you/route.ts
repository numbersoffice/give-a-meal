import { getPayload } from "payload";
import config from "@payload-config";
import { NextRequest, NextResponse } from "next/server";
import donorThankYouTemplate from "@/components/emailTemplates/donorThankYou";

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Verify admin user
    const { user } = await payload.auth({ headers: request.headers });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { donorId, donationId } = body;

    if (!donorId) {
      return NextResponse.json(
        { error: "donorId is required" },
        { status: 400 }
      );
    }

    const donor = await payload.findByID({
      collection: "donors",
      id: donorId,
    });

    if (!donor?.email) {
      return NextResponse.json(
        { error: "Donor has no email address" },
        { status: 400 }
      );
    }

    let businessName: string | undefined;
    let donationName: string | undefined;

    if (donationId) {
      const donation = await payload.findByID({
        collection: "donations",
        id: donationId,
        depth: 2,
      });

      const item =
        typeof donation.item === "object" ? donation.item : null;
      const business =
        typeof donation.business === "object" ? donation.business : null;

      donationName = item?.title || undefined;
      businessName = business?.businessName || undefined;
    }

    const donorProfileUrl = `https://give-a-meal.org/donors/profile?pe=${encodeURIComponent(donor.email)}`;

    const { text, html } = donorThankYouTemplate({
      businessName,
      donationName,
      donorProfileUrl,
    });

    await payload.sendEmail({
      to: donor.email,
      subject: "Thank you for your donation!",
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Thank you email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
