import MenuItemMobile from "../menuItemMobile";
import styles from "./styles.module.css";

type MenuItem = {
  label: string;
  link: string;
  prefetch?: boolean;
};

/**
 * Renders a menu component.
 * Adds activity state based on the current route.
 * @param menuItems - The array of menu items.
 * @returns The rendered menu component.
 */
export default function MenuMobile({
  menuItems,
  className,
}: {
  menuItems: MenuItem[];
  className?: string;
}) {
  return (
    <div className={`${styles.container} ${className}`}>
      {menuItems.map((item, index) => (
        <MenuItemMobile
          key={index}
          label={item.label}
          link={item.link}
          prefetch={item.prefetch}
        />
      ))}
    </div>
  );
}
