import HeaderDonorProfile from "@/components/headerDonorProfile";
import s from "./layout.module.css";
import Menu from "@/components/menu";
import { Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary-server";
import localeLink from "@/utils/localeLink";
import { headers } from "next/headers";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const {
    pages: {
      donors: {
        layout: { menu, header },
      },
    },
  } = await getDictionary(lang);

  return (
    <div className={s.layoutWrapper}>
      <div className={s.headerWrapper}>
        <HeaderDonorProfile title={header.title} />
      </div>
      <hr />
      <div className={s.contentWrapper}>
        {/* Desktop only */}
        <Menu
          className={s.desktopElement}
          menuItems={[
            { label: menu.profile, link: localeLink("/donors/profile", lang) },
            {
              label: menu.donations,
              link: localeLink("/donors/profile/donations", lang),
            },
            {
              label: menu.logout,
              link: `/api/auth/logout?lang=${lang}`,
              prefetch: false,
            },
          ]}
        />
        <div>{children}</div>
      </div>
    </div>
  );
}
