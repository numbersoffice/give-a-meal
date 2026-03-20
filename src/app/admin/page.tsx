"use client";

import React from "react";
import { CountCard, PlaceholderCountCard } from "@/components/admin/countCard";
import Nav from "@/components/admin/nav";
import { useAdminUser } from "@/hooks/useAdminUser";
import { apiGet } from "@/lib/admin/api";
import styles from "@/styles/admin/dashboard.module.css";

type Count = { title: string; count: number };

export default function AdminDashboard() {
  const user = useAdminUser();
  const [counts, setCounts] = React.useState<Count[]>();

  React.useEffect(() => {
    apiGet<Count[]>("/api/admin/counts")
      .then(setCounts)
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const linkedPages = ["Verifications", "Profiles"];

  return (
    <>
      <Nav user={user} title="Dashboard" />

      <div className={styles.page}>
        <div className={styles.greeting}>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.subtitle}>
            Platform activity at a glance
          </p>
        </div>

        <div className={styles.grid}>
          {counts ? (
            counts.map((table) => (
              <CountCard
                href={
                  linkedPages.includes(table.title)
                    ? `/admin/${table.title.toLowerCase()}`
                    : null
                }
                key={table.title}
                count={table.count}
                title={table.title}
              />
            ))
          ) : (
            <>
              <PlaceholderCountCard />
              <PlaceholderCountCard />
              <PlaceholderCountCard />
              <PlaceholderCountCard />
              <PlaceholderCountCard />
            </>
          )}
        </div>
      </div>
    </>
  );
}
