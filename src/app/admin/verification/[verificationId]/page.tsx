"use client";

import React from "react";
import Nav from "@/components/admin/nav";
import { useAdminUser } from "@/hooks/useAdminUser";
import { useParams } from "next/navigation";
import VerificationCard from "@/components/admin/verificationCard";
import { apiGet } from "@/lib/admin/api";
import pageStyles from "@/styles/admin/page.module.css";

export default function AdminVerification() {
  const params = useParams();
  const user = useAdminUser();
  const [verification, setVerification] = React.useState<any>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    apiGet(`/api/admin/verifications/${params.verificationId}`)
      .then((data: any) => {
        setVerification(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Nav user={user} title="Verification" />
      <div className={pageStyles.page}>
        <VerificationCard verification={verification} isLoading={isLoading} />
      </div>
    </>
  );
}
