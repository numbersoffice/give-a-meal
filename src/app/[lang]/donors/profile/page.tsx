import MenuMobile from "@/components/menuMobile";
import { Locale } from "@/i18n-config";
import GeneralPage from "./general/page";
import s from "./styles.module.css";
import localeLink from "@/utils/localeLink";
import { getDictionary } from "@/get-dictionary-server";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: { [key: string]: string | undefined };
  params: { lang: Locale };
}) {
  const {
    pages: {
      donors: {
        layout: { menu },
      },
    },
  } = await getDictionary(params.lang);

  return (
    <>
      {/* Desktop only */}
      <div className={s.desktopOnly}>
        <GeneralPage params={params} searchParams={searchParams} />
      </div>
      {/* Mobile only */}
      <div className={s.mobileOnly}>
        <MenuMobile
          menuItems={[
            {
              label: menu.profile,
              link: localeLink("/donors/profile/general", params.lang),
            },
            {
              label: menu.donations,
              link: localeLink("/donors/profile/donations", params.lang),
            },
            {
              label: menu.logout,
              link: `/api/auth/logout?lang=${params.lang}`,
              prefetch: false,
            },
          ]}
        />
      </div>
    </>
  );
}
