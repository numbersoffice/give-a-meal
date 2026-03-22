import s from "./styles.module.css"
export default function Loading() {
    return (
        <div className={s.container}>
            <h4>Donations</h4>
            <div className={s.donationsContainer}>
                <div className={s.loadingSkeleton} />
                <div className={s.loadingSkeleton} />
                <div className={s.loadingSkeleton} />
            </div>
        </div>
    );
};