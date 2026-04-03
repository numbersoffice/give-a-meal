import s from "./styles.module.css";
import Image from "next/image";

export default function CustomLogo() {
  return (
    <div className={s.wrapper}>
      <Image
        src="/assets/images/wordmark.png"
        alt="Give a Meal wordmark"
        width={476}
        height={70}
      />
      <span>Admin</span>
    </div>
  );
}
