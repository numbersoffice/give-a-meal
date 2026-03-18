import React from "react";
import styles from "@/styles/document.module.css";
import { Metadata } from "next";
import Footer from "@/components/footer";
import { Locale } from "@/i18n-config";

export const metadata: Metadata = {
  title: "Account deletion",
  description: "Contact us to request deletion of your account.",
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return (
    <>
      <div className={`grid ${styles.wrapper}`}>
        <div className={styles.container}>
          <div className={styles.titleContainer}>
            <h2>Account deletion</h2>
            <p className="body_s">Last updated Jul 18, 2023</p>
          </div>

          <div className={styles.spacer} />

          <p className="body">
            When you delete your account we will retain some data about
            donations you have redeemed and/or submitted.
          </p>
          <br />
          <p className="body">
            Please contact <b>max@give-a-meal.org</b> to request an account
            deletion.
          </p>
        </div>
      </div>
      <Footer lang={lang} />
    </>
  );
}
