"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./styles.module.css";

type Donor = { id: string; email: string; firstName?: string; lastName?: string };
type Donation = {
  id: string;
  item: { title?: string } | string;
  business: { businessName?: string } | string;
  createdAt?: string;
};

export default function ThankYouEmailWidgetClient() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"donor" | "donation">("donor");
  const [donorSearch, setDonorSearch] = useState("");
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [loadingDonors, setLoadingDonors] = useState(false);
  const [loadingDonations, setLoadingDonations] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    const showLoading = donors.length === 0;
    const timeout = setTimeout(async () => {
      if (showLoading) setLoadingDonors(true);
      try {
        const where = donorSearch
          ? `where[email][contains]=${encodeURIComponent(donorSearch)}`
          : "";
        const res = await fetch(`/api/donors?${where}&limit=20`, {
          credentials: "include",
        });
        const data = await res.json();
        setDonors(data.docs || []);
      } catch {
        setDonors([]);
      }
      setLoadingDonors(false);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [donorSearch, open]);

  useEffect(() => {
    if (!selectedDonor || step !== "donation") return;
    setLoadingDonations(true);
    fetch(
      `/api/donations?where[donatedBy][equals]=${selectedDonor.id}&depth=2&limit=50&sort=-createdAt`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => setDonations(data.docs || []))
      .catch(() => setDonations([]))
      .finally(() => setLoadingDonations(false));
  }, [selectedDonor, step]);

  const handleSelectDonor = useCallback((donor: Donor) => {
    setSelectedDonor(donor);
    setStep("donation");
  }, []);

  const handleSend = useCallback(async (withDonation: boolean) => {
    if (!selectedDonor) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/custom/donations/thank-you", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          donorId: selectedDonor.id,
          donationId: withDonation && selectedDonation ? selectedDonation.id : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }
      setResult({ success: true, message: `Email sent to ${selectedDonor.email}` });
    } catch (err: any) {
      setResult({ success: false, message: err.message });
    }
    setSending(false);
  }, [selectedDonor, selectedDonation]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setStep("donor");
    setDonorSearch("");
    setDonors([]);
    setSelectedDonor(null);
    setDonations([]);
    setSelectedDonation(null);
    setResult(null);
  }, []);

  const getDonationLabel = (d: Donation) => {
    const item = typeof d.item === "object" ? d.item?.title : "Unknown item";
    const biz = typeof d.business === "object" ? d.business?.businessName : "Unknown business";
    return `${item || "Unknown item"} at ${biz || "Unknown business"}`;
  };

  return (
    <>
      <div className={`card ${styles.widget}`}>
        <div>
          <p className={styles.widgetLabel}>Donor Outreach</p>
          <p className={styles.widgetDescription}>
            Send a thank-you email to a donor with a link to their portal.
          </p>
        </div>
        <button
          type="button"
          className={`btn btn--style-primary btn--size-medium ${styles.widgetButton}`}
          onClick={() => setOpen(true)}
        >
          Send Thank You Email
        </button>
      </div>

      {open && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className={styles.modal}>
            {/* Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {result
                  ? result.success
                    ? "Email Sent"
                    : "Error"
                  : step === "donor"
                    ? "Select a Donor"
                    : "Select a Donation (Optional)"}
              </h3>
              <button type="button" onClick={handleClose} className={styles.closeButton}>
                &times;
              </button>
            </div>

            {/* Body */}
            <div className={styles.modalBody}>
              {result ? (
                <div className={result.success ? styles.resultSuccess : styles.resultError}>
                  {result.message}
                </div>
              ) : step === "donor" ? (
                <>
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={donorSearch}
                    onChange={(e) => setDonorSearch(e.target.value)}
                    className={styles.searchInput}
                    autoFocus
                  />
                  <div className={styles.listContainer}>
                    {loadingDonors ? (
                      <p className={styles.hint}>Loading...</p>
                    ) : donors.length === 0 ? (
                      <p className={styles.hint}>
                        {donorSearch ? "No donors found." : "Type to search donors."}
                      </p>
                    ) : (
                      donors.map((donor) => (
                        <button
                          key={donor.id}
                          type="button"
                          onClick={() => handleSelectDonor(donor)}
                          className={styles.listItem}
                        >
                          <strong>{donor.email}</strong>
                          {(donor.firstName || donor.lastName) && (
                            <span className={styles.listItemName}>
                              {[donor.firstName, donor.lastName].filter(Boolean).join(" ")}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.donorChip}>
                    <span>
                      Donor: <strong>{selectedDonor?.email}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("donor");
                        setSelectedDonation(null);
                      }}
                      className={styles.changeButton}
                    >
                      Change
                    </button>
                  </div>

                  <p className={styles.donationHint}>
                    Optionally select a specific donation to reference in the email:
                  </p>

                  {loadingDonations ? (
                    <p className={styles.hint}>Loading donations...</p>
                  ) : donations.length === 0 ? (
                    <p className={styles.hint}>No donations found for this donor.</p>
                  ) : (
                    donations.map((donation) => (
                      <button
                        key={donation.id}
                        type="button"
                        onClick={() =>
                          setSelectedDonation(
                            selectedDonation?.id === donation.id ? null : donation
                          )
                        }
                        className={`${styles.listItem} ${
                          selectedDonation?.id === donation.id ? styles.listItemSelected : ""
                        }`}
                      >
                        {getDonationLabel(donation)}
                      </button>
                    ))
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {!result && step === "donation" && (
              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className="btn btn--style-primary btn--size-medium"
                  onClick={() => handleSend(!!selectedDonation)}
                  disabled={sending}
                >
                  {sending
                    ? "Sending..."
                    : selectedDonation
                      ? "Send with Donation Details"
                      : "Send General Thank You"}
                </button>
                <button
                  type="button"
                  className="btn btn--style-secondary btn--size-medium"
                  onClick={handleClose}
                  disabled={sending}
                >
                  Cancel
                </button>
              </div>
            )}

            {result && (
              <div className={styles.modalFooterEnd}>
                <button
                  type="button"
                  className="btn btn--style-primary btn--size-medium"
                  onClick={handleClose}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
