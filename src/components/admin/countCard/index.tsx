"use client";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export function CountCard({ count, title, href }: { count: number; title: string; href: string | null }) {
  const router = useRouter();

  function handleRoute() {
    if (href) router.push(href);
  }

  return (
    <div
      onClick={handleRoute}
      className={`${styles.card} ${href ? styles.clickable : ""}`}
    >
      <span className={styles.label}>{title}</span>
      <span className={styles.count}>{count ?? 0}</span>
      {href && (
        <span className={styles.footer}>
          View all <span className={styles.arrow}>&rarr;</span>
        </span>
      )}
    </div>
  );
}

export function PlaceholderCountCard() {
  return <div className={styles.skeleton} />;
}
