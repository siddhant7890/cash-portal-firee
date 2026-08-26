// import { formatINR } from "@/lib/calc";

// const PRINTER_NAME =
//   process.env.NEXT_PUBLIC_PRINTER_NAME || "Thermal — Front counter";

// export default function ApprovalModal({
//   bill,
//   mode,
//   onClose,
//   onConfirm,
//   confirming,
//   conflictMessage,
//   reviewWarning,
// }) {
//   if (!bill) return null;

//   return (
//     <div className="sf-modal-overlay" onClick={onClose}>
//       <div
//         className="sf-panel"
//         style={{
//           width: 400,
//           maxWidth: "100%",
//           textAlign: "center",
//           background: "#fff",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* <div className={`sf-modal-icon ${mode}`}>
//           {mode === "cash" ? (
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <rect x="2" y="6" width="20" height="12" rx="2" />
//               <circle cx="12" cy="12" r="2.5" />
//             </svg>
//           ) : (
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//               <rect x="4" y="2" width="16" height="20" rx="2" />
//               <path d="M8 6h8M8 18h.01" />
//             </svg>
//           )}
//         </div> */}
//         <div className={`sf-modal-icon ${mode}`}>
//           {mode === "cash" && (
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <rect x="2" y="6" width="20" height="12" rx="2" />
//               <circle cx="12" cy="12" r="2.5" />
//             </svg>
//           )}
//           {mode === "upi" && (
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <rect x="4" y="2" width="16" height="20" rx="2" />
//               <path d="M8 6h8M8 18h.01" />
//             </svg>
//           )}
//           {mode === "reject" && (
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M18 6L6 18M6 6l12 12" />
//             </svg>
//           )}
//         </div>

//         {/* <div className="font-display fw-semibold" style={{ fontSize: 18 }}>
//           Confirm payment & print bill
//         </div> */}
//         <div className="font-display fw-semibold" style={{ fontSize: 18 }}>
//   {mode === "reject" ? "Reject this bill?" : "Confirm payment & print bill"}
// </div>
// <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18 }}>
//   {mode === "reject"
//     ? "The sales staff will need to re-check and resubmit it."
//     : "Please confirm before the bill prints at the counter"}
// </div>
//         <div
//           style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18 }}
//         >
//           Please confirm before the bill prints at the counter
//         </div>

//         {conflictMessage && (
//           <div className="sf-conflict-banner">
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <circle cx="12" cy="12" r="9" />
//               <path d="M12 8v5M12 16h.01" />
//             </svg>
//             <div>{conflictMessage}</div>
//           </div>
//         )}

//         {!conflictMessage && reviewWarning && (
//           <div
//             className="sf-conflict-banner"
//             style={{ background: "var(--upi-soft)", color: "var(--upi)" }}
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <circle cx="12" cy="12" r="9" />
//               <path d="M12 7v5l3 2" />
//             </svg>
//             <div>
//               {reviewWarning} You can still proceed, but check with them first.
//             </div>
//           </div>
//         )}

//         <div className="sf-modal-bill-card mb-3">
//           <div className="sf-modal-bill-row">
//             <span>Bill No</span>
//             <span className="mono">{bill.billNo}</span>
//           </div>
//           <div className="sf-modal-bill-row">
//             <span>Customer</span>
//             <span>{bill.customerName}</span>
//           </div>
//           <div className="sf-modal-bill-row">
//             <span>Sales person</span>
//             <span>{bill.salesPerson}</span>
//           </div>
//           <div className="sf-modal-bill-row total">
//             <span>Amount</span>
//             <span className="mono">{formatINR(bill.grandTotal)}</span>
//           </div>
//         </div>
// {mode !== "reject" && (
//         <div className="d-flex gap-2 mb-3">
//           <div
//             className={`sf-mode-pill ${mode === "cash" ? "selected cash" : ""}`}
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <rect x="2" y="6" width="20" height="12" rx="2" />
//               <circle cx="12" cy="12" r="2.5" />
//             </svg>
//             Cash
//           </div>
          
//           <div
//             className={`sf-mode-pill ${mode === "upi" ? "selected upi" : ""}`}
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <rect x="4" y="2" width="16" height="20" rx="2" />
//               <path d="M8 6h8M8 18h.01" />
//             </svg>
//             UPI
//           </div>
//         </div>
// )}
// {mode !== "reject" && (
//         <div className="sf-printer-note mb-3">
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
//             <rect x="6" y="14" width="12" height="8" />
//           </svg>
//           Will print on&nbsp;<strong>{PRINTER_NAME}</strong>
//         </div>
// )}
//         <div className="d-flex gap-2">
//           <button
//             className="sf-btn flex-grow-1 justify-content-center"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//   <button
//   className={`sf-btn ${mode === "reject" ? "sf-btn-reject" : "sf-btn-primary"} flex-grow-1 justify-content-center`}
//   onClick={() => onConfirm(bill, mode)}
//   disabled={confirming || Boolean(conflictMessage)}
// >
//   {mode !== "reject" && (
//     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//       <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
//       <rect x="6" y="14" width="12" height="8" />
//     </svg>
//   )}
//   {confirming ? "Working..." : mode === "reject" ? "Reject Bill" : "Confirm & Print Bill"}
// </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { formatINR } from "@/lib/calc";

// const PRINTER_NAME =
//   process.env.NEXT_PUBLIC_PRINTER_NAME || "Thermal — Front counter";

// export default function ApprovalModal({
//   bill,
//   mode,
//   onClose,
//   onConfirm,
//   confirming,
//   conflictMessage,
//   reviewWarning,
// }) {
//   if (!bill) return null;

//   const { tokenNumber, customerMobile, gstNumber } = bill;

//   return (
//     <div className="sf-modal-overlay" onClick={onClose}>
//       <div
//         className="sf-panel"
//         style={{
//           width: 400,
//           maxWidth: "100%",
//           textAlign: "center",
//           background: "#fff",
//         }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className={`sf-modal-icon ${mode}`}>
//           {mode === "cash" && (
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <rect x="2" y="6" width="20" height="12" rx="2" />
//               <circle cx="12" cy="12" r="2.5" />
//             </svg>
//           )}
//           {mode === "upi" && (
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <rect x="4" y="2" width="16" height="20" rx="2" />
//               <path d="M8 6h8M8 18h.01" />
//             </svg>
//           )}
//           {mode === "reject" && (
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M18 6L6 18M6 6l12 12" />
//             </svg>
//           )}
//         </div>

//         <div className="font-display fw-semibold" style={{ fontSize: 18 }}>
//           {mode === "reject" ? "Reject this bill?" : "Confirm payment & print bill"}
//         </div>
//         <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18 }}>
//           {mode === "reject"
//             ? "The sales staff will need to re-check and resubmit it."
//             : "Please confirm before the bill prints at the counter"}
//         </div>

//         {conflictMessage && (
//           <div className="sf-conflict-banner">
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <circle cx="12" cy="12" r="9" />
//               <path d="M12 8v5M12 16h.01" />
//             </svg>
//             <div>{conflictMessage}</div>
//           </div>
//         )}

//         {!conflictMessage && reviewWarning && (
//           <div
//             className="sf-conflict-banner"
//             style={{ background: "var(--upi-soft)", color: "var(--upi)" }}
//           >
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <circle cx="12" cy="12" r="9" />
//               <path d="M12 7v5l3 2" />
//             </svg>
//             <div>
//               {reviewWarning} You can still proceed, but check with them first.
//             </div>
//           </div>
//         )}

//         {tokenNumber && (
//           <div
//             style={{
//               background: "var(--brand-soft, #fff3e0)",
//               color: "var(--brand, #b45309)",
//               borderRadius: 10,
//               padding: "10px 14px",
//               marginBottom: 14,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//             }}
//           >
//             <span style={{ fontSize: 12.5, fontWeight: 600 }}>
//               Customer's token
//             </span>
//             <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace" }}>
//               #{tokenNumber}
//             </span>
//           </div>
//         )}

//         <div className="sf-modal-bill-card mb-3">
//           <div className="sf-modal-bill-row">
//             <span>Bill No</span>
//             <span className="mono">{bill.billNo}</span>
//           </div>
//           <div className="sf-modal-bill-row">
//             <span>Customer</span>
//             <span>{bill.customerName || "-"}</span>
//           </div>
//           {customerMobile && (
//             <div className="sf-modal-bill-row">
//               <span>Mobile</span>
//               <span className="mono">{customerMobile}</span>
//             </div>
//           )}
//           {gstNumber && (
//             <div className="sf-modal-bill-row">
//               <span>Customer GSTIN</span>
//               <span className="mono">{gstNumber}</span>
//             </div>
//           )}
//           <div className="sf-modal-bill-row">
//             <span>Sales person</span>
//             <span>{bill.salesPerson}</span>
//           </div>
//           <div className="sf-modal-bill-row">
//             <span>Items</span>
//             <span>{bill.itemCount}</span>
//           </div>
//           <div className="sf-modal-bill-row total">
//             <span>Amount</span>
//             <span className="mono">{formatINR(bill.grandTotal)}</span>
//           </div>
//         </div>

//         {mode !== "reject" && (
//           <div className="d-flex gap-2 mb-3">
//             <div
//               className={`sf-mode-pill ${mode === "cash" ? "selected cash" : ""}`}
//             >
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <rect x="2" y="6" width="20" height="12" rx="2" />
//                 <circle cx="12" cy="12" r="2.5" />
//               </svg>
//               Cash
//             </div>

//             <div
//               className={`sf-mode-pill ${mode === "upi" ? "selected upi" : ""}`}
//             >
//               <svg
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <rect x="4" y="2" width="16" height="20" rx="2" />
//                 <path d="M8 6h8M8 18h.01" />
//               </svg>
//               UPI
//             </div>
//           </div>
//         )}

//         {mode !== "reject" && (
//           <div className="sf-printer-note mb-3">
//             <svg
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
//               <rect x="6" y="14" width="12" height="8" />
//             </svg>
//             Will print on&nbsp;<strong>{PRINTER_NAME}</strong>
//           </div>
//         )}

//         <div className="d-flex gap-2">
//           <button
//             className="sf-btn flex-grow-1 justify-content-center"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className={`sf-btn ${mode === "reject" ? "sf-btn-reject" : "sf-btn-primary"} flex-grow-1 justify-content-center`}
//             onClick={() => onConfirm(bill, mode)}
//             disabled={confirming || Boolean(conflictMessage)}
//           >
//             {mode !== "reject" && (
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
//                 <rect x="6" y="14" width="12" height="8" />
//               </svg>
//             )}
//             {confirming ? "Working..." : mode === "reject" ? "Reject Bill" : "Confirm & Print Bill"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { formatINR } from "@/lib/calc";

const PRINTER_NAME =
  process.env.NEXT_PUBLIC_PRINTER_NAME || "Thermal — Front counter";

function roundToNearestRupee(value) {
  const n = Number(value) || 0;
  return Math.round(n);
}

export default function ApprovalModal({
  bill,
  mode: initialMode,
  onClose,
  onUpdate,
  onConfirm,
  confirming,
  conflictMessage,
  reviewWarning,
}) {
  const [customerName, setCustomerName] = useState("");
  const [gstin, setGstin] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState(initialMode); // cash | upi | credit | cash_upi
  const [cashAmount, setCashAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [hasUpdated, setHasUpdated] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!bill) return;
    setCustomerName(bill.customerName || "");
    setGstin(bill.gstNumber || bill.gstin || "");
    setDiscountAmount("");
    setPaymentMode(initialMode === "reject" ? null : initialMode || "cash");
    setCashAmount("");
    setUpiAmount("");
    setHasUpdated(false);
  }, [bill, initialMode]);

  const calculations = useMemo(() => {
    if (!bill) return null;

    const original = Number(bill.grandTotal) || 0;
    const originalTaxable = Number(bill.taxableTotal) || 0;
    const originalCgst = Number(bill.cgstTotal) || 0;
    const originalSgst = Number(bill.sgstTotal) || 0;

    // GST rates are derived from the bill's own tax/taxable ratio rather
    // than a hardcoded 9%/9%, so this keeps working if a bill ever carries
    // a different GST slab.
    const cgstRate = originalTaxable > 0 ? originalCgst / originalTaxable : 0;
    const sgstRate = originalTaxable > 0 ? originalSgst / originalTaxable : 0;

    const discount = Math.max(0, Number(discountAmount) || 0);
    const taxableAfterDiscount = Math.max(0, originalTaxable - discount);
    const cgst = taxableAfterDiscount * cgstRate;
    const sgst = taxableAfterDiscount * sgstRate;
    const afterDiscount = taxableAfterDiscount + cgst + sgst;
    const rounded = roundToNearestRupee(afterDiscount);
    const roundOff = Number((rounded - afterDiscount).toFixed(2));

    return {
      original,
      originalTaxable,
      discount,
      taxableAfterDiscount,
      cgst,
      sgst,
      afterDiscount,
      rounded,
      roundOff,
    };
  }, [bill, discountAmount]);

  // Auto-fill cash / upi amounts when mode or final amount changes
  useEffect(() => {
    if (!calculations || initialMode === "reject") return;

    const final = calculations.rounded;

    if (paymentMode === "cash") {
      setCashAmount(String(final));
      setUpiAmount("0");
    } else if (paymentMode === "upi") {
      setCashAmount("0");
      setUpiAmount(String(final));
    } else if (paymentMode === "credit") {
      setCashAmount("0");
      setUpiAmount("0");
    }
    // cash_upi → keep whatever user typed
  }, [paymentMode, calculations?.rounded, initialMode]);

  const isDirty = useMemo(() => {
    if (!bill) return false;
    const nameChanged =
      (customerName.trim() || "") !== (bill.customerName || "");
    const gstChanged =
      (gstin.trim() || "") !== (bill.gstNumber || bill.gstin || "");
    const discountChanged = Number(discountAmount || 0) > 0;
    // Credit and Cash+UPI carry extra state (the credit flag, the split
    // amounts) that only reaches the backend via the Update Bill call —
    // there's no separate field edit to detect, so these modes are always
    // treated as dirty until that update has run.
    const modeNeedsUpdate = paymentMode === "credit" || paymentMode === "cash_upi";
    return nameChanged || gstChanged || discountChanged || modeNeedsUpdate;
  }, [bill, customerName, gstin, discountAmount, paymentMode]);

  if (!bill) return null;

  const isReject = initialMode === "reject";
  const { tokenNumber, customerMobile } = bill;

  const cashNum = Number(cashAmount) || 0;
  const upiNum = Number(upiAmount) || 0;
  const splitTotal = cashNum + upiNum;
  const finalAmount = calculations?.rounded || 0;

  const splitMismatch =
    paymentMode === "cash_upi" && Math.abs(splitTotal - finalAmount) > 0.01;

  const buildPayload = () => {
    let total_cash = 0;
    let total_upi = 0;

    if (paymentMode === "cash") {
      total_cash = finalAmount;
      total_upi = 0;
    } else if (paymentMode === "upi") {
      total_cash = 0;
      total_upi = finalAmount;
    } else if (paymentMode === "cash_upi") {
      total_cash = cashNum;
      total_upi = upiNum;
    } else if (paymentMode === "credit") {
      total_cash = 0;
      total_upi = 0;
    }

    return {
      customerName: customerName.trim() || bill.customerName,
      gstNumber: gstin.trim() || null,
      discount_amount: calculations.discount,
      taxable_amount: calculations.taxableAfterDiscount,
      cgst_amount: calculations.cgst,
      sgst_amount: calculations.sgst,
      grandTotal: calculations.rounded,
      round_off_amount: calculations.roundOff,
      originalGrandTotal: calculations.original,
      paymentMode,
      total_cash,
      total_upi,
    };
  };

  async function handleUpdateClick() {
    if (!onUpdate) return;
    if (splitMismatch) return;

    setUpdating(true);
    try {
      await onUpdate(bill, buildPayload());
      setHasUpdated(true);
    } catch (err) {
      // parent sets conflictMessage
    } finally {
      setUpdating(false);
    }
  }

  function handleConfirmClick() {
    if (isReject) {
      onConfirm(bill, "reject");
      return;
    }
    if (splitMismatch) return;
    onConfirm(bill, paymentMode, buildPayload());
  }

  const showUpdateButton = !isReject && isDirty && !hasUpdated;
  const showApproveButton = isReject || !isDirty || hasUpdated;

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
          width: 440,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          textAlign: "center",
          background: "#fff",
          margin: "auto",
          borderRadius: 12,
          boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`sf-modal-icon ${isReject ? "reject" : paymentMode || "cash"}`}>
          {isReject ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : paymentMode === "upi" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M8 6h8M8 18h.01" />
            </svg>
          ) : paymentMode === "credit" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
          ) : paymentMode === "cash_upi" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="2.5" />
            </svg>
          )}
        </div>

        <div className="font-display fw-semibold" style={{ fontSize: 18 }}>
          {isReject ? "Reject this bill?" : "Confirm payment & print bill"}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 18 }}>
          {isReject
            ? "The sales staff will need to re-check and resubmit it."
            : isDirty && !hasUpdated
              ? "You have made changes. Please update the bill first."
              : "Edit details if needed, then confirm before the bill prints"}
        </div>

        {conflictMessage && (
          <div className="sf-conflict-banner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <div>
              {reviewWarning} You can still proceed, but check with them first.
            </div>
          </div>
        )}

        {tokenNumber && (
          <div
            style={{
              background: "var(--brand-soft, #fff3e0)",
              color: "var(--brand, #b45309)",
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Customer's token</span>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "monospace" }}>
              #{tokenNumber}
            </span>
          </div>
        )}

        {/* Bill details card */}
        <div className="sf-modal-bill-card mb-3" style={{ textAlign: "left" }}>
          <div className="sf-modal-bill-row">
            <span>Bill No</span>
            <span className="mono">{bill.billNo}</span>
          </div>

          <div className="sf-modal-bill-row" style={{ alignItems: "center" }}>
            <span>Customer</span>
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: 180, textAlign: "right", fontSize: 13 }}
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setHasUpdated(false);
              }}
              placeholder="Customer name"
              disabled={isReject}
            />
          </div>

          {customerMobile && (
            <div className="sf-modal-bill-row">
              <span>Mobile</span>
              <span className="mono">{customerMobile}</span>
            </div>
          )}

          <div className="sf-modal-bill-row" style={{ alignItems: "center" }}>
            <span>Customer GSTIN</span>
            <input
              type="text"
              className="form-control form-control-sm mono"
              style={{ width: 180, textAlign: "right", fontSize: 13 }}
              value={gstin}
              onChange={(e) => {
                setGstin(e.target.value.toUpperCase());
                setHasUpdated(false);
              }}
              placeholder="GSTIN (optional)"
              maxLength={15}
              disabled={isReject}
            />
          </div>

          <div className="sf-modal-bill-row">
            <span>Sales person</span>
            <span>{bill.salesPerson}</span>
          </div>
          <div className="sf-modal-bill-row">
            <span>Items</span>
            <span>{bill.itemCount}</span>
          </div>

          {bill.numberOfCartoon != null && (
            <div className="sf-modal-bill-row">
              <span>No. of Cartons</span>
              <span>{bill.numberOfCartoon}</span>
            </div>
          )}

          <div className="sf-modal-bill-row">
            <span>Taxable Amount</span>
            <span className="mono">{formatINR(calculations.originalTaxable)}</span>
          </div>

          {!isReject && (
            <div className="sf-modal-bill-row" style={{ alignItems: "center" }}>
              <span>Discount (₹)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control form-control-sm mono no-spinner"
                style={{ width: 120, textAlign: "right", fontSize: 13 }}
                value={discountAmount}
                onChange={(e) => {
                  setDiscountAmount(e.target.value);
                  setHasUpdated(false);
                }}
                placeholder="0"
              />
            </div>
          )}

          {calculations.discount > 0 && (
            <div className="sf-modal-bill-row">
              <span>Taxable after Discount</span>
              <span className="mono">{formatINR(calculations.taxableAfterDiscount)}</span>
            </div>
          )}

          <div className="sf-modal-bill-row">
            <span>CGST</span>
            <span className="mono">{formatINR(calculations.cgst)}</span>
          </div>

          <div className="sf-modal-bill-row">
            <span>SGST</span>
            <span className="mono">{formatINR(calculations.sgst)}</span>
          </div>

          {calculations.roundOff !== 0 && (
            <div className="sf-modal-bill-row">
              <span>Round off</span>
              <span className="mono">
                {calculations.roundOff > 0 ? "+" : ""}
                {formatINR(calculations.roundOff)}
              </span>
            </div>
          )}

          <div className="sf-modal-bill-row total">
            <span>Final Payable</span>
            <span className="mono">{formatINR(calculations.rounded)}</span>
          </div>
        </div>

        {/* Payment mode pills — hidden after successful update */}
        {!isReject && !hasUpdated && (
          <div className="d-flex gap-2 mb-3 flex-wrap justify-content-center">
            {[
              { key: "cash", label: "Cash" },
              { key: "upi", label: "UPI" },
              { key: "credit", label: "Credit" },
              { key: "cash_upi", label: "Cash + UPI" },
            ].map(({ key, label }) => {
              const isSelected = paymentMode === key;
              return (
                <div
                  key={key}
                  onClick={() => {
                    setPaymentMode(key);
                    setHasUpdated(false);
                  }}
                  className={`sf-mode-pill ${isSelected ? `selected ${key}` : ""}`}
                  style={{
                    cursor: "pointer",
                    minWidth: 90,
                    ...(isSelected
                      ? {
                          background:
                            key === "cash"
                              ? "var(--cash-soft, #e8f5e9)"
                              : key === "upi"
                                ? "var(--upi-soft, #e3f2fd)"
                                : key === "credit"
                                  ? "var(--brand-soft, #fff3e0)"
                                  : "#f3e8ff",
                          color:
                            key === "cash"
                              ? "var(--cash, #2e7d32)"
                              : key === "upi"
                                ? "var(--upi, #1565c0)"
                                : key === "credit"
                                  ? "var(--brand, #b45309)"
                                  : "#6b21a8",
                          border: `1.5px solid ${
                            key === "cash"
                              ? "var(--cash, #2e7d32)"
                              : key === "upi"
                                ? "var(--upi, #1565c0)"
                                : key === "credit"
                                  ? "var(--brand, #b45309)"
                                  : "#6b21a8"
                          }`,
                          fontWeight: 700,
                        }
                      : {
                          background: "#f5f5f5",
                          color: "#666",
                          border: "1.5px solid #ddd",
                        }),
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        )}

        {/* Locked payment mode message after update */}
        {!isReject && hasUpdated && paymentMode && (
          <div
            style={{
              marginBottom: 14,
              padding: "8px 12px",
              borderRadius: 8,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              fontSize: 13,
              fontWeight: 600,
              color: "#166534",
            }}
          >
            Payment locked as:{" "}
            {paymentMode === "cash"
              ? "Cash"
              : paymentMode === "upi"
                ? "UPI"
                : paymentMode === "credit"
                  ? "Credit"
                  : "Cash + UPI"}
          </div>
        )}

        {/* Cash + UPI split inputs */}
        {!isReject && paymentMode === "cash_upi" && (
          <div
            style={{
              background: "#faf5ff",
              border: "1px solid #e9d5ff",
              borderRadius: 10,
              padding: "12px 14px",
              marginBottom: 14,
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 10, color: "#6b21a8" }}>
              Split Payment
            </div>

            <div className="sf-modal-bill-row" style={{ alignItems: "center", marginBottom: 8 }}>
              <span>Cash Amount (₹)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control form-control-sm mono"
                style={{ width: 130, textAlign: "right", fontSize: 13 }}
                value={cashAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  setCashAmount(val);
                  const remaining = finalAmount - (Number(val) || 0);
                  setUpiAmount(String(Math.max(0, Math.round(remaining * 100) / 100)));
                  setHasUpdated(false);
                }}
                placeholder="0"
                disabled={hasUpdated}
              />
            </div>

            <div className="sf-modal-bill-row" style={{ alignItems: "center", marginBottom: 8 }}>
              <span>UPI Amount (₹)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form-control form-control-sm mono"
                style={{ width: 130, textAlign: "right", fontSize: 13 }}
                value={upiAmount}
                onChange={(e) => {
                  const val = e.target.value;
                  setUpiAmount(val);
                  const remaining = finalAmount - (Number(val) || 0);
                  setCashAmount(String(Math.max(0, Math.round(remaining * 100) / 100)));
                  setHasUpdated(false);
                }}
                placeholder="0"
                disabled={hasUpdated}
              />
            </div>

            <div className="sf-modal-bill-row" style={{ alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>Total (Cash + UPI)</span>
              <span
                className="mono"
                style={{
                  fontWeight: 700,
                  color: splitMismatch ? "var(--danger, #c62828)" : "inherit",
                }}
              >
                {formatINR(splitTotal)}
              </span>
            </div>

            {splitMismatch && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--danger, #c62828)",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Cash + UPI must equal Final Payable ({formatINR(finalAmount)})
              </div>
            )}
          </div>
        )}

        {/* Read-only summary for single modes */}
        {!isReject && paymentMode === "cash" && (
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
            Total Cash: <strong>{formatINR(finalAmount)}</strong> · Total UPI: ₹0
          </div>
        )}
        {!isReject && paymentMode === "upi" && (
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
            Total Cash: ₹0 · Total UPI: <strong>{formatINR(finalAmount)}</strong>
          </div>
        )}
        {!isReject && paymentMode === "credit" && (
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 12 }}>
            Credit · Total Cash: ₹0 · Total UPI: ₹0
          </div>
        )}

        {!isReject && (
          <div className="sf-printer-note mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Will print on&nbsp;<strong>{PRINTER_NAME}</strong>
          </div>
        )}

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button
            className="sf-btn flex-grow-1 justify-content-center"
            onClick={onClose}
            disabled={confirming || updating}
          >
            Cancel
          </button>

          {showUpdateButton && (
            <button
              className="sf-btn sf-btn-primary flex-grow-1 justify-content-center"
              onClick={handleUpdateClick}
              disabled={updating || Boolean(conflictMessage) || splitMismatch}
            >
              {updating ? "Updating..." : "Update Bill"}
            </button>
          )}

          {showApproveButton && (
            <button
              className={`sf-btn ${
                isReject ? "sf-btn-reject" : "sf-btn-primary"
              } flex-grow-1 justify-content-center`}
              onClick={handleConfirmClick}
              disabled={
                confirming ||
                Boolean(conflictMessage) ||
                (!isReject && !paymentMode) ||
                splitMismatch
              }
            >
              {confirming
                ? "Working..."
                : isReject
                  ? "Reject Bill"
                  : "Confirm & Print Bill"}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .no-spinner::-webkit-outer-spin-button,
        .no-spinner::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}