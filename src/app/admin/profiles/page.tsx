"use client";

import React from "react";
import Nav from "@/components/admin/nav";
import Placeholder from "@/components/admin/placeholder";
import Table, {
  TableRowLoading,
  TableHead,
  TableRow,
} from "@/components/admin/table";
import { useAdminUser } from "@/hooks/useAdminUser";
import { apiGet } from "@/lib/admin/api";
import formatDateString from "@/utils/admin/formatDateString";
import pageStyles from "@/styles/admin/page.module.css";

type Profile = {
  auth_id: string;
  created_at: string;
  email: string;
  first_name: string | null;
  id: number;
  last_name: string | null;
  push_token: string | null;
  updated_at: string;
};

export default function AdminProfiles() {
  const user = useAdminUser();
  const [profiles, setProfiles] = React.useState<
    { userEmail: string; createdAt: string; id: number }[]
  >([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    apiGet<Profile[]>("/api/admin/profiles")
      .then((data) => {
        const transformedData = data.map((profile) => {
          return {
            userEmail: profile.email,
            createdAt: formatDateString(profile.created_at),
            id: profile.id,
          };
        });
        setIsLoading(false);
        setProfiles(transformedData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      <Nav user={user} title="Profiles" />
      <div className={pageStyles.page}>
        {profiles.length === 0 && !isLoading && (
          <Placeholder text="No profiles" />
        )}
        {(profiles.length > 0 || isLoading) && (
          <Table>
            <TableHead columns={["User", "Created at"]} />
            {!isLoading ? (
              profiles.map((el) => (
                <TableRow
                  key={el.id}
                  columns={[el.userEmail, el.createdAt]}
                />
              ))
            ) : (
              <TableRowLoading numberOfColumns={2} />
            )}
          </Table>
        )}
      </div>
    </>
  );
}
