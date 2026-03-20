"use client";
import { signOut as _signOut } from "@firebase/auth";
import { auth } from "@/lib/admin/firebase";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function Nav({ title, user }: { title: string; user: any }) {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/admin/auth/session", { method: "DELETE" });
    await _signOut(auth);
    router.push("/admin/auth");
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.left}>
        <span onClick={() => router.push("/admin")} className={styles.brand}>
          Give a Meal
        </span>
        {title && (
          <>
            <span className={styles.separator}>/</span>
            <span className={styles.title}>{title}</span>
          </>
        )}
      </div>
      <button data-variant="ghost" disabled={!user} onClick={signOut}>
        Sign out
      </button>
    </nav>
  );
}
