import MenuMobile from "@/components/menuMobile";
import { Locale } from "@/i18n-config";
import GeneralPage from "./general/page";
import s from "./styles.module.css";
import localeLink from "@/utils/localeLink";
import { getDictionary } from "@/get-dictionary-server";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const {
    pages: {
      donors: {
        layout: { menu },
      },
    },
  } = await getDictionary(lang);

  return (
    <>
      {/* Desktop only */}
      <div className={s.desktopOnly}>
        <GeneralPage params={params} />
      </div>
      {/* Mobile only */}
      <div className={s.mobileOnly}>
        <MenuMobile
          menuItems={[
            {
              label: menu.profile,
              link: localeLink("/donors/profile/general", lang),
            },
            {
              label: menu.donations,
              link: localeLink("/donors/profile/donations", lang),
            },
            {
              label: menu.logout,
              link: `/api/custom/auth/logout?lang=${lang}`,
              prefetch: false,
            },
          ]}
        />
      </div>
    </>
  );
}
