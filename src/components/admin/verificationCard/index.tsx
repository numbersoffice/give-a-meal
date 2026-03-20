"use client";

import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/admin/api";

export default function VerificationCard({ verification, isLoading }: { verification: any; isLoading: boolean }) {
  const router = useRouter();
  const formattedAddress = React.useMemo(() => {
    if (verification)
      return `${verification.address.streetNumber} ${verification.address.address}, ${verification.address.city} ${verification.address.state} ${verification.address.postalCode}`;
    else return null;
  }, [verification]);

  const [declineLoading, setDeclineLoading] = React.useState<boolean>(false);
  const [acceptLoading, setAcceptLoading] = React.useState<boolean>(false);

  function declineVerification() {
    setDeclineLoading(true);
    apiPost(`/api/admin/verifications/${verification.id}/decline`)
      .then(() => {
        setDeclineLoading(false);
        alert("DECLINED");
        router.push("/admin/verifications");
      })
      .catch((error) => {
        setDeclineLoading(false);
        alert(`Error: ${error}`);
      });
  }
  function acceptVerification() {
    setAcceptLoading(true);
    apiPost(`/api/admin/verifications/${verification.id}/accept`)
      .then(() => {
        setAcceptLoading(false);
        alert("ACCEPTED");
        router.push("/admin/verifications");
      })
      .catch((error) => {
        setAcceptLoading(false);
        alert(`Error: ${error}`);
      });
  }

  return (
    <div
      className={`${styles.verificationCard} ${isLoading ? styles.loading : ""}`}
    >
      {!isLoading && verification && (
        <>
          <h2>{verification.address.businessName}</h2>
          <p>{formattedAddress}</p>
          <p>{verification.address.country}</p>
          <hr />
          <div className={styles.contactContainer}>
            <div>
              <h4>Email</h4>
              <p>{verification.verificationEmail}</p>
            </div>
            <div>
              <h4>Phone</h4>
              <p>{verification.verificationPhone}</p>
            </div>
            <div>
              <h4>Notes</h4>
              <p>{verification.verificationNotes}</p>
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              disabled={declineLoading || acceptLoading}
              onClick={declineVerification}
              data-type="warning"
            >
              {declineLoading ? "Loading..." : "Decline"}
            </button>
            <button
              disabled={declineLoading || acceptLoading}
              onClick={acceptVerification}
            >
              {acceptLoading ? "Loading..." : "Accept"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
