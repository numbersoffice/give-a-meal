import Button from "../button";
import s from "./styles.module.css";
import Image from "next/image";
import Tomato from "@/public/assets/tomato.svg";
import Cucumber from "@/public/assets/cucumber.svg";

export default function DonationCard({
  className,
  dict,
}: {
  className?: string;
  dict: {
    title: string;
    subOne: string;
    subTwo: string;
    button: string;
    divider: string;
  };
}) {
  return (
    <div className={`${s.container} ${className}`}>
      <h2>{dict.title}</h2>
      <p className="body">{dict.subOne}</p>
      <Button
        href="https://donate.stripe.com/28oeXq9cc0Vz2PeeUX"
        className={s.button}
        large
      >
        {dict.button}
      </Button>
      <p className="body">
        <strong>{dict.divider}</strong>
      </p>
      <p className="body">{dict.subTwo}</p>
      <Image className={s.tomato} src={Tomato} alt="tomato" width={150} />
      <Image className={s.cucumber} src={Cucumber} alt="cucumber" width={177} />
    </div>
  );
}
