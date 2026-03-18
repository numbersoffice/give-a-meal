import Header from "@/components/header";
import styles from "./page.module.css";
import AppCard from "@/components/appCard";
import UserIcon from "@/public/assets/images/icon-user.jpg";
import BusinessIcon from "@/public/assets/images/icon-business.jpg";
import { Metadata } from "next";
import { getDictionary } from "@/get-dictionary-server";
import { Locale } from "@/i18n-config";
import Footer from "@/components/footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const {
    pages: {
      getTheApp: { meta },
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
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const {
    pages: {
      getTheApp: { hero, apps },
    },
  } = await getDictionary(lang);

  return (
    <>
      <div className={`grid ${styles.container}`}>
        <Header title={hero.title} className={styles.header} variant={1} />
        <AppCard
          appStoreLink="https://apps.apple.com/app/id1631730593"
          playStoreLink="https://play.google.com/store/apps/details?id=com.fotura.giveamealuser&pli=1"
          className={styles.cardOne}
          title={apps[0].title}
          description={apps[0].sub}
          imageSrc={UserIcon}
        />
        <AppCard
          appStoreLink="https://apps.apple.com/app/id6449883589"
          playStoreLink="https://play.google.com/store/apps/details?id=com.fotura.giveamealbusiness"
          className={styles.cardTwo}
          title={apps[1].title}
          description={apps[1].sub}
          imageSrc={BusinessIcon}
        />
      </div>
      <Footer lang={lang} />
    </>
  );
}
