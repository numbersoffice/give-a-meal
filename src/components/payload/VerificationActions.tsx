"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDocumentInfo } from "@payloadcms/ui";

export default function VerificationActions() {
  const { id } = useDocumentInfo();
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);

  if (!id) return null;

  async function handleAction(action: "accept" | "decline") {
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this verification?`
    );
    if (!confirmed) return;

    setLoading(action);
    try {
      const res = await fetch(
        `/api/verifications/${id}/${action}`,
        { method: "POST", credentials: "include" }
      );
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action}`);
      }
      router.push("/admin/collections/verifications");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setLoading(null);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        padding: "16px 20px",
        marginBottom: "24px",
        borderRadius: "4px",
        background: "var(--theme-elevation-50)",
        border: "1px solid var(--theme-elevation-150)",
        alignItems: "center",
      }}
    >
      <span style={{ flex: 1, fontWeight: 500 }}>
        Review this verification:
      </span>
      <button
        type="button"
        className="btn btn--style-secondary btn--size-medium"
        disabled={loading !== null}
        onClick={() => handleAction("decline")}
        style={{
          backgroundColor: "var(--theme-error-500)",
          color: "white",
          border: "none",
        }}
      >
        {loading === "decline" ? "Declining..." : "Decline"}
      </button>
      <button
        type="button"
        className="btn btn--style-secondary btn--size-medium"
        disabled={loading !== null}
        onClick={() => handleAction("accept")}
        style={{
          backgroundColor: "var(--theme-success-500)",
          color: "white",
          border: "none",
        }}
      >
        {loading === "accept" ? "Accepting..." : "Accept"}
      </button>
    </div>
  );
}
