import Link from "next/link";
import s from "./styles.module.css";

export default function MenuItem({
  link,
  label,
  active,
  prefetch = undefined,
}: {
  link: string;
  label: string;
  active: boolean;
  prefetch?: boolean;
}) {
  return (
    <Link
      prefetch={prefetch}
      href={link}
      className={`${s.container} ${active && s.active}`}
    >
      <p>{label}</p>
    </Link>
  );
}
