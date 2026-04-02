import { CircleAlert, CircleX, Info } from "lucide-react"
import styles from "./styles.module.css"

const icons = {
    error: <CircleX size={18} />,
    warning: <CircleAlert size={18} />,
    info: <Info size={18} />,
}

export default function Callout({ children, type = "error" }: { children: React.ReactNode, type?: "error" | "warning" | "info" }) {
    return (
        <div className={`${styles.callout} ${styles[type]}`}>
            <span className={styles.icon}>{icons[type]}</span>
            <p className={styles.message}>{children}</p>
        </div>
    )
}
