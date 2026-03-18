import s from "./styles.module.css";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary-server";
import localeLink from "@/utils/localeLink";
import HeaderLinkMobile from "@/components/headerLinkMobile";
import BackArrow from "@/public/assets/icons/back-arrow.svg";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const {
    elements: { buttons },
    pages: {
      donors: {
        layout: { menu, header },
      },
    },
  } = await getDictionary(lang);

  return (
    <>
      <HeaderLinkMobile
        icon={BackArrow}
        href={localeLink("/donors/profile", lang)}
        className={s.backLinkMobile}
      >
        {buttons.back}
      </HeaderLinkMobile>
      <div>{children}</div>
    </>
  );
}
