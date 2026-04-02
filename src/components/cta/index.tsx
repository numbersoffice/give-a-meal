import Button from "../button";
import styles from "./styles.module.css";
import Image from "next/image";
import Cucumber from "@/public/assets/cucumber.svg";
import Tomato from "@/public/assets/tomato.svg";

export default function CTA({
  className,
  title,
  description,
  buttonLabel,
  href,
}: {
  className?: string;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <div className={`${styles.container} ${className}`}>
      <Image
        className={styles.tomato}
        src={Tomato}
        alt="tomato"
        width={285}
        height={420}
      />
      <Image
        className={styles.cucumber}
        src={Cucumber}
        alt="cucumber"
        width={377}
        height={430}
      />

      <div className={styles.textContainer}>
        <h2>{title}</h2>
        <p className="body_l">{description}</p>
      </div>
      <Button className={styles.button} href={href}>
        {buttonLabel}
      </Button>
    </div>
  );
}
