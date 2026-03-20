"use client";

import React from "react";
import Nav from "@/components/admin/nav";
import Placeholder from "@/components/admin/placeholder";
import Table, {
  TableHead,
  TableRow,
  TableRowLoading,
} from "@/components/admin/table";
import { useAdminUser } from "@/hooks/useAdminUser";
import { apiGet } from "@/lib/admin/api";
import formatDateString from "@/utils/admin/formatDateString";
import pageStyles from "@/styles/admin/page.module.css";

type Verification = {
  verification_email: string;
  user_email: string;
  created_at: string;
  verification_id: string;
};

export default function AdminVerifications() {
  const user = useAdminUser();
  const [verifications, setVerifications] = React.useState<Verification[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    apiGet<any[]>("/api/admin/verifications")
      .then((data) => {
        const transformedData = data.map((verification) => {
          return {
            verification_email: verification.verification_email,
            user_email: verification.user_email,
            created_at: formatDateString(verification.created_at),
            verification_id: verification.id,
          };
        });
        setIsLoading(false);
        setVerifications(transformedData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <Nav user={user} title="Verifications" />
      <div className={pageStyles.page}>
        {verifications.length > 0 || isLoading ? (
          <Table>
            <TableHead columns={["Email", "Created at"]} />
            {!isLoading ? (
              verifications.map((el) => (
                <TableRow
                  key={el.verification_id}
                  columns={[el.verification_email, el.created_at]}
                  urlData={{
                    href: `/admin/verification/${el.verification_id}`,
                    params: el.verification_id,
                  }}
                />
              ))
            ) : (
              <TableRowLoading numberOfColumns={2} />
            )}
          </Table>
        ) : (
          <Placeholder text="No pending verifications" />
        )}
      </div>
    </>
  );
}
