"use client";

import { usePathname } from "next/navigation";
import MenuItem from "../menuItem";
import styles from "./styles.module.css";

type MenuItem = {
  label: string;
  link: string;
  prefetch?: boolean;
};

/**
 * Renders a menu component.
 * Adds activity state based on the current route.
 * @param {MenuItem[]} menuItems - The array of menu items.
 * @returns {JSX.Element} The rendered menu component.
 */
export default function Menu({
  menuItems,
  className,
}: {
  menuItems: MenuItem[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div className={`${styles.container} ${className}`}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          label={item.label}
          link={item.link}
          active={pathname === item.link}
          prefetch={item.prefetch}
        />
      ))}
    </div>
  );
}
