import Image from "next/image";
import { headers } from "next/headers";
import Button from "@/components/button";
import Tomato from "@/public/assets/tomato.svg";
import Onion from "@/public/assets/onion.svg";
import { getDictionary } from "@/get-dictionary-server";
import { i18n, Locale } from "@/i18n-config";
import styles from "./not-found.module.css"

export default async function NotFound() {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const lang: Locale = i18n.locales.includes(firstSegment as Locale)
    ? (firstSegment as Locale)
    : i18n.defaultLocale;

  const { pages: { notFound: t } } = await getDictionary(lang);

  return (
    <div className={styles.container}>
      <Image
        className={styles.vegLeft}
        src={Tomato}
        alt=""
        width={250}
        height={364}
        aria-hidden
      />
      <Image
        className={styles.vegRight}
        src={Onion}
        alt=""
        width={200}
        height={295}
        aria-hidden
      />

      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h2>{t.title}</h2>
        <p className="body">{t.description}</p>
        <Button href={`/${lang}`}>{t.cta}</Button>
      </div>
    </div>
  );
}
