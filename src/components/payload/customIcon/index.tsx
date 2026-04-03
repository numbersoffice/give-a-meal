import s from "./styles.module.css";
import Image from "next/image";

export default function CustomIcon() {
  return (
    <Image fill src="/assets/images/favicon.png" className={s.img} alt="favicon" />
  );
}
