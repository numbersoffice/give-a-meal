import Header from "@/components/header";
import styles from "./page.module.css";
import Badge from "@/components/badge";
import InfoCards from "@/components/infoCards";
import FAQ from "@/components/faq";
import { Metadata } from "next";
import { getDictionary } from "@/get-dictionary-server";
import { Locale } from "@/i18n-config";
import Footer from "@/components/footer";
import NearbyRestaurants from "@/components/nearbyRestaurants";
import DonationCard from "@/components/donationCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const {
    pages: {
      giveAMeal: { meta },
    },
  } = await getDictionary(lang);

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const {
    pages: {
      giveAMeal: { hero, howTo, faq, map, donate },
    },
  } = await getDictionary(lang);

  return (
    <>
      <div className={`grid ${styles.container}`}>
        {/* <Header title={hero.title} className={styles.header} variant={2} />*/}
        <h2 className={styles.description}>{hero.sub}</h2>
        <DonationCard className={styles.donationCardContainer} dict={donate} />

        <Badge className={styles.badgeHowItWorks}>{howTo.title}</Badge>
        <InfoCards items={howTo.cards} className={styles.infoCardContainer} />
        <Badge className={styles.badgeHowItWorks}>{map.title}</Badge>
        <NearbyRestaurants className={styles.businessMap} dict={map} />
        <Badge className={styles.badgeFAQ}>{faq.title}</Badge>
        <FAQ items={faq.questions} className={styles.faqContainer} />
      </div>
      <Footer lang={lang} />
    </>
  );
}
