"use client";
import styles from "./styles.module.css";

export default function Placeholder({ text }: { text: string }) {
  return (
    <div className={styles.container}>
      <h2>{text}</h2>
    </div>
  );
}
