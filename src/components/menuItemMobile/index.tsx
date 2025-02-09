import Link from "next/link";
import s from "./styles.module.css";

export default function MenuItem({
  link,
  label,
  prefetch,
}: {
  link: string;
  label: string;
  prefetch?: boolean;
}) {
  return (
    <Link prefetch={prefetch} href={link} className={s.container}>
      <p>{label}</p>
    </Link>
  );
}
