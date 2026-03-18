"use client";

import Badge from "@/components/badge";
import InfoCard from "@/components/infoCard";
import { getDictionary } from "@/get-dictionary-client";
import { Locale } from "@/i18n-config";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function How({ lang }: { lang: Locale }) {
  const [dictionary, setDictionary] = useState<Awaited<
    ReturnType<typeof getDictionary>
  > | null>(null);

  useEffect(() => {
    getDictionary(lang).then((res) => setDictionary(res));
  }, [lang]);

  if (!dictionary) return null;

  const {
    pages: {
      home: {
        howTo: { cards, title },
      },
    },
  } = dictionary;

  return (
    <div className={`${styles.container} grid`}>
      <Badge className={styles.badge}>{title}</Badge>
      <InfoCard
        active
        className={styles.cardOne}
        title={cards[0].title}
        sub={cards[0].sub}
        number={1}
      />
      <InfoCard
        className={styles.cardTwo}
        title={cards[1].title}
        sub={cards[1].sub}
        number={2}
      />
      <InfoCard
        className={styles.cardThree}
        title={cards[2].title}
        sub={cards[2].sub}
        number={4}
      />
    </div>
  );
}
