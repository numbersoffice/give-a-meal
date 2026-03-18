import Header from "@/components/header";
import styles from "./page.module.css";
import Badge from "@/components/badge";
import InfoCards from "@/components/infoCards";
import FAQ from "@/components/faq";
import CTA from "@/components/cta";
import { Metadata } from "next";
import { getDictionary } from "@/get-dictionary-server";
import { Locale } from "@/i18n-config";
import localeLink from "@/utils/localeLink";
import GetTheApp from "@/components/getTheApp/GetTheApp";
import Footer from "@/components/footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const {
    pages: {
      restaurantPartners: { meta },
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
      restaurantPartners: { hero, howTo, faq, cta },
    },
  } = await getDictionary(lang);

  return (
    <>
      <div className={`grid ${styles.container}`}>
        <GetTheApp lang={lang} />
        <Header title={hero.title} className={styles.header} variant={3} />
        <h2 className={styles.description}>{hero.sub}</h2>
        <Badge className={styles.badgeHowItWorks}>{howTo.title}</Badge>
        <InfoCards items={howTo.cards} className={styles.infoCardContainer} />
        <Badge className={styles.badgeFAQ}>{faq.title}</Badge>
        <FAQ items={faq.questions} className={styles.faqContainer} />
        <CTA
          className={styles.cta}
          title={cta.title}
          description={cta.sub}
          buttonLabel={cta.button}
          href={localeLink("/app", lang)}
        />
      </div>
      <Footer spacerClass={styles.ctaAdjustements} lang={lang} />
    </>
  );
}
