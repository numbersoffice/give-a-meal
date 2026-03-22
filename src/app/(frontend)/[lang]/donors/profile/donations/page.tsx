import ListItem from "@/components/listItem";
import s from "./styles.module.css";
import { getDictionary } from "@/get-dictionary-server";
import { Locale } from "@/i18n-config";
import { getPayload } from "payload";
import config from "@payload-config";

export const revalidate = 0;

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
  params: Promise<{ lang: string }>;
}) {
  const sp = await searchParams;
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const {
    pages: { donors },
  } = await getDictionary(lang);

  const donorId = sp?.id || "";

  // Get donations from Payload
  const payload = await getPayload({ config });
  const { docs: donations } = await payload.find({
    collection: "donations",
    where: {
      donatedBy: { equals: donorId },
    },
    depth: 1,
  });

  return (
    <div className={s.container}>
      <h4>
        {donors.donations.title} {donations && "(" + donations.length + ")"}
      </h4>
      <div className={s.donationsContainer}>
        {donations?.map((donation: any) => (
          <ListItem
            key={donation.id}
            title={donation.item?.title}
            date={donation.createdAt}
            text={donation.business?.businessName}
            chip={
              donation.redeemedAt
                ? donors.donations.donationElement.badge.claimed
                : null
            }
          />
        ))}
        {!donations || donations.length === 0 ? (
          <p className={s.placeholder}>
            No donations, yet. Provide your email address when you donate to
            track your giving here.
          </p>
        ) : null}
      </div>
    </div>
  );
}
