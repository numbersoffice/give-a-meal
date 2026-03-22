import type { WidgetServerProps } from "payload";

export default async function DonationCountWidget({
  req,
}: WidgetServerProps) {
  const { payload } = req;

  const { totalDocs } = await payload.count({
    collection: "donations",
  });

  return (
    <div className="card" style={{ padding: "24px" }}>
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "var(--theme-elevation-500)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Donations
      </p>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: "48px",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        {totalDocs}
      </p>
    </div>
  );
}
