import Link from "next/link";
import styles from "./styles.module.css";
import { JSX } from "react";

export default function Button({
    className,
    wrapperClassName,
    href,
    onClick,
    children,
    icon,
    large,
    isLoading,
    disabled
}: {
    href?: string,
    children: any,
    onClick?: () => void,
    className?: string,
    wrapperClassName?: string;
    icon?: JSX.Element,
    large?: boolean,
    isLoading?: boolean
    disabled?: boolean
}) {

    const content = (
        <button disabled={disabled} type="submit" onClick={onClick} className={`body ${styles.container} ${large && styles.large} ${isLoading && styles.isLoading} ${className}`}>
            {isLoading && <div className={styles.spinner} />}
            {!isLoading && <div className={styles.content}>{icon && icon}{children}</div>}
        </button>
    )

    if (href) return <Link className={`${styles.link} ${wrapperClassName}`} href={href}>{content}</Link>
    else return <div className={wrapperClassName}>{content}</div>
}