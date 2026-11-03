import { useEffect, useState } from "react";
import { formatINR } from "@/lib/calc";

// Shows one bill's full detail — read-only by default, with an Edit
// toggle for customer name / GSTIN / mobile / discount. Print is wired
// straight to the shared thermal-receipt hook via onPrint, so this modal
// and the row-level Print button both produce the exact same receipt.
export default function CashLogDetailModal({
  bill,
  startInEdit,
  onClose,
  onSave,
  onPrint,
  saving,
  errorMessage,
}) {
  const [editing, setEditing] = useState(Boolean(startInEdit));
  const [customerName, setCustomerName] = useState("");
  const [gstin, setGstin] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");

  useEffect(() => {
    if (!bill) return;
    setEditing(Boolean(startInEdit));
    setCustomerName(bill.customerName || "");
    setGstin(bill.gstNumber || "");
    setMobileNumber(bill.customerMobile || "");
    setDiscountAmount(
      bill.discountTotal != null && Number(bill.discountTotal) > 0
        ? String(bill.discountTotal)
        : ""
    );
  }, [bill, startInEdit]);

  if (!bill) return null;

  async function handleSave() {
    await onSave(bill, {
      customerName: customerName.trim() || bill.customerName,
      gstNumber: gstin.trim() || null,
      customerMobile: mobileNumber.trim() || null,
      discount_amount: Math.max(0, Number(discountAmount) || 0),
    });
    setEditing(false);
  }

  return (
    <div
      className="sf-modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        overflowY: "auto",
      }}
    >
      <div
        className="sf-panel"
        style={{
          width: 460,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          textAlign: "left",
          background: "#fff",
          margin: "auto",
          borderRadius: 12,
          boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="font-display fw-semibold"
          style={{ fontSize: 18, marginBottom: 2 }}
        >
          {editing ? "Edit Bill" : "Bill Details"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 16 }}>
          {bill.billNo} ·{" "}
          <span
            className={`sf-status-pill ${String(bill.status || "").toLowerCase()}`}
            style={{ marginLeft: 2 }}
          >
            <span className="dot" />
            {bill.status || "-"}
          </span>
        </div>

        {errorMessage && (
          <div className="sf-conflict-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            <div>{errorMessage}</div>
          </div>
        )}

        <div className="sf-modal-bill-card mb-3">
          <div className="sf-modal-bill-row">
            <span>Date</span>
            <span className="mono">
              {bill.submittedAt ? new Date(bill.submittedAt).toLocaleString("en-IN") : "-"}
            </span>
          </div>
          <div className="sf-modal-bill-row">
            <span>Sales person</span>
            <span>{bill.salesPerson || "-"}</span>
          </div>

          <div className="sf-modal-bill-row" style={{ alignItems: "center" }}>
            <span>Customer</span>
            {editing ? (
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ width: 200, textAlign: "right", fontSize: 13 }}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer name"
              />
            ) : (
              <span>{bill.customerName || "-"}</span>
            )}
          </div>

          <div className="sf-modal-bill-row" style={{ alignItems: "center" }}>
            <span>Mobile</span>
            {editing ? (
              <input
                type="tel"
                className="form-control form-control-sm mono"
                style={{ width: 200, textAlign: "right", fontSize: 13 }}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={10}
                placeholder="Mobile number"
              />
            ) : (
              <span className="mono">{bill.customerMobile || "-"}</span>
            )}
          </div>

          <div className="sf-modal-bill-row" style={{ alignItems: "center" }}>
            <span>GSTIN/PAN</span>
            {editing ? (
              <input
                type="text"
                className="form-control form-control-sm mono"
                style={{ width: 200, textAlign: "right", fontSize: 13 }}
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                maxLength={15}
                placeholder="GSTIN (optional)"
              />
            ) : (
              <span className="mono">{bill.gstNumber || "-"}</span>
            )}
          </div>

          <div className="sf-modal-bill-row">
            <span>Items</span>
            <span>{bill.itemCount ?? bill.items?.length ?? 0}</span>
          </div>
          {bill.numberOfCartoon != null && (
            <div className="sf-modal-bill-row">
              <span>No. of Cartons</span>
              <span>{bill.numberOfCartoon}</span>
            </div>
          )}

          <div className="sf-modal-bill-row">
            <span>Taxable Amount</span>
            <span className="mono">{formatINR(bill.taxableTotal)}</span>
          </div>
          <div className="sf-modal-bill-row">
            <span>CGST</span>
            <span className="mono">{formatINR(bill.cgstTotal)}</span>
          </div>
          <div className="sf-modal-bill-row">
            <span>SGST</span>
            <span className="mono">{formatINR(bill.sgstTotal)}</span>
          </div>

          <div className="sf-modal-bill-row" style={{ alignItems: "center" }}>
            <span>Discount (₹)</span>
            {editing ? (
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control form-control-sm mono no-spinner"
                style={{ width: 120, textAlign: "right", fontSize: 13 }}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                onWheel={(ev) => ev.target.blur()}
                placeholder="0"
              />
            ) : (
              <span className="mono">{formatINR(bill.discountTotal)}</span>
            )}
          </div>

          <div className="sf-modal-bill-row total">
            <span>Total Amount</span>
            <span className="mono">{formatINR(bill.grandTotal)}</span>
          </div>
        </div>

        {Array.isArray(bill.items) && bill.items.length > 0 && (
          <div className="sf-table-wrap mb-3" style={{ maxHeight: 220, overflowY: "auto" }}>
            <table className="sf-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.productName}</td>
                    <td className="mono">{it.qty}</td>
                    <td className="mono">{formatINR(it.totalAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            className="sf-btn flex-grow-1 justify-content-center"
            onClick={onClose}
            disabled={saving}
          >
            Close
          </button>

          <button
            className="sf-btn flex-grow-1 justify-content-center"
            onClick={() => onPrint(bill)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print
          </button>

          {editing ? (
            <button
              className="sf-btn sf-btn-primary flex-grow-1 justify-content-center"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          ) : (
            <button
              className="sf-btn sf-btn-primary flex-grow-1 justify-content-center"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
