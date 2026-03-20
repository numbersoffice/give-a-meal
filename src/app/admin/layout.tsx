import "@/styles/admin/globals.css";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="admin-root">{children}</div>
      </body>
    </html>
  );
}
