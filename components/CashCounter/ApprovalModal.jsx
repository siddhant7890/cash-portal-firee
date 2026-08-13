import { formatINR } from "@/lib/calc";

const PRINTER_NAME =
  process.env.NEXT_PUBLIC_PRINTER_NAME || "Thermal — Front counter";

export default function ApprovalModal({
  bill,
  mode,
  onClose,
  onConfirm,
  confirming,
  conflictMessage,
  reviewWarning,
}) {
  if (!bill) return null;

  return (
    <div className="sf-modal-overlay" onClick={onClose}>
      <div
        className="sf-panel"
        style={{
          width: 400,
          maxWidth: "100%",
          textAlign: "center",
          background: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div className={`sf-modal-icon ${mode}`}>
          {mode === "cash" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M8 6h8M8 18h.01" />
            </svg>
          )}
        </div> */}
        <div className={`sf-modal-icon ${mode}`}>
          {mode === "cash" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          )}
          {mode === "upi" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M8 6h8M8 18h.01" />
            </svg>
          )}
          {mode === "reject" && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* <div className="font-display fw-semibold" style={{ fontSize: 18 }}>
          Confirm payment & print bill
        </div> */}
        <div className="font-display fw-semibold" style={{ fontSize: 18 }}>
  {mode === "reject" ? "Reject this bill?" : "Confirm payment & print bill"}
</div>
<div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18 }}>
  {mode === "reject"
    ? "The sales staff will need to re-check and resubmit it."
    : "Please confirm before the bill prints at the counter"}
</div>
        <div
          style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18 }}
        >
          Please confirm before the bill prints at the counter
        </div>

        {conflictMessage && (
          <div className="sf-conflict-banner">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            <div>{conflictMessage}</div>
          </div>
        )}

        {!conflictMessage && reviewWarning && (
          <div
            className="sf-conflict-banner"
            style={{ background: "var(--upi-soft)", color: "var(--upi)" }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <div>
              {reviewWarning} You can still proceed, but check with them first.
            </div>
          </div>
        )}

        <div className="sf-modal-bill-card mb-3">
          <div className="sf-modal-bill-row">
            <span>Bill No</span>
            <span className="mono">{bill.billNo}</span>
          </div>
          <div className="sf-modal-bill-row">
            <span>Customer</span>
            <span>{bill.customerName}</span>
          </div>
          <div className="sf-modal-bill-row">
            <span>Sales person</span>
            <span>{bill.salesPerson}</span>
          </div>
          <div className="sf-modal-bill-row total">
            <span>Amount</span>
            <span className="mono">{formatINR(bill.grandTotal)}</span>
          </div>
        </div>
{mode !== "reject" && (
        <div className="d-flex gap-2 mb-3">
          <div
            className={`sf-mode-pill ${mode === "cash" ? "selected cash" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
            Cash
          </div>
          
          <div
            className={`sf-mode-pill ${mode === "upi" ? "selected upi" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M8 6h8M8 18h.01" />
            </svg>
            UPI
          </div>
        </div>
)}
{mode !== "reject" && (
        <div className="sf-printer-note mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Will print on&nbsp;<strong>{PRINTER_NAME}</strong>
        </div>
)}
        <div className="d-flex gap-2">
          <button
            className="sf-btn flex-grow-1 justify-content-center"
            onClick={onClose}
          >
            Cancel
          </button>
  <button
  className={`sf-btn ${mode === "reject" ? "sf-btn-reject" : "sf-btn-primary"} flex-grow-1 justify-content-center`}
  onClick={() => onConfirm(bill, mode)}
  disabled={confirming || Boolean(conflictMessage)}
>
  {mode !== "reject" && (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  )}
  {confirming ? "Working..." : mode === "reject" ? "Reject Bill" : "Confirm & Print Bill"}
</button>
        </div>
      </div>
    </div>
  );
}
