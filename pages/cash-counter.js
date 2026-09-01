// // import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// // import Layout from "@/components/Layout/Layout";
// // import ApprovalModal from "@/components/CashCounter/ApprovalModal";
// // import { useRequireAuth } from "@/context/AuthContext";
// // import { getPendingBills, approveBill , rejectBill } from "@/lib/api";
// // import { formatINR } from "@/lib/calc";

// // const POLL_MS =
// //   (Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_SECONDS) || 10) * 1000;

// // function timeAgo(iso) {
// //   const mins = Math.max(
// //     1,
// //     Math.round((Date.now() - new Date(iso).getTime()) / 60000),
// //   );
// //   if (mins < 60) return `${mins} min ago`;
// //   return `${Math.round(mins / 60)} hr ago`;
// // }

// // // Stable pseudo-random split — a bill always lands in the same block on
// // // every render/poll (hashed from its id), rather than jumping between
// // // blocks each refresh, which would be confusing to work against.
// // function splitGroup(id) {
// //   const str = String(id);
// //   let hash = 0;
// //   for (let i = 0; i < str.length; i++) {
// //     hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
// //   }
// //   return hash % 2 === 0 ? "A" : "B";
// // }

// // function matchesSearch(bill, query) {
// //   if (!query.trim()) return true;
// //   const q = query.trim().toLowerCase();
// //   return (
// //     bill.billNo.toLowerCase().includes(q) ||
// //     bill.customerName.toLowerCase().includes(q)
// //   );
// // }

// // function PendingBlock({ label, bills, search, onSearchChange, onApprove }) {
// //   const filtered = bills.filter((b) => matchesSearch(b, search));

// //   return (
// //     <div className="sf-panel">
// //       <div className="sf-panel-title">
// //         {label} ({bills.length})
// //       </div>

// //       <div className="sf-search-bar mb-3">
// //         <svg
// //           viewBox="0 0 24 24"
// //           fill="none"
// //           stroke="currentColor"
// //           strokeWidth="2"
// //         >
// //           <circle cx="11" cy="11" r="7" />
// //           <path d="M21 21l-4.3-4.3" />
// //         </svg>
// //         <input
// //           placeholder="Search bill no. or customer name"
// //           value={search}
// //           onChange={(e) => onSearchChange(e.target.value)}
// //         />
// //       </div>

// //       {bills.length === 0 && (
// //         <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
// //           No bills waiting right now.
// //         </div>
// //       )}
// //       {bills.length > 0 && filtered.length === 0 && (
// //         <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
// //           No bills match &quot;{search}&quot;.
// //         </div>
// //       )}

// //       {filtered.map((b) => (
// //         <div key={b.id} className="sf-queue-row">
// //           <div className="sf-qinfo">
// //             <div className="sf-qbill">{b.billNo}</div>
// //             <div className="sf-qcust">{b.customerName}</div>
// //             <div className="sf-qsub">
// //               {b.salesPerson} · {b.itemCount} item{b.itemCount === 1 ? "" : "s"}{" "}
// //               · submitted {timeAgo(b.submittedAt)}
// //             </div>
// //           </div>
// //           <div className="sf-qamt">{formatINR(b.grandTotal)}</div>
// //           <div className="d-flex gap-2">
// //             <button
// //               className="sf-btn sf-btn-cash sf-btn-sm"
// //               onClick={() => onApprove(b, "cash")}
// //             >
// //               <svg
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth="2"
// //               >
// //                 <rect x="2" y="6" width="20" height="12" rx="2" />
// //                 <circle cx="12" cy="12" r="2.5" />
// //               </svg>
// //               Cash
// //             </button>
// //             <button
// //               className="sf-btn sf-btn-upi sf-btn-sm"
// //               onClick={() => onApprove(b, "upi")}
// //             >
// //               <svg
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth="2"
// //               >
// //                 <rect x="4" y="2" width="16" height="20" rx="2" />
// //                 <path d="M8 6h8M8 18h.01" />
// //               </svg>
// //               UPI
// //             </button>
// //             <button
// //               className="sf-btn sf-btn-reject sf-btn-sm"
// //               onClick={() => onApprove(b, "reject")}
// //             >
// //               <svg
// //                 viewBox="0 0 24 24"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 strokeWidth="2"
// //               >
// //                 <path d="M18 6L6 18M6 6l12 12" />
// //               </svg>
// //               Reject
// //             </button>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }

// // export default function CashCounterPage() {
// //   const { user, ready } = useRequireAuth();
// //   const [pending, setPending] = useState([]);
// //   const [approvedThisSession, setApprovedThisSession] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [loadError, setLoadError] = useState(null);
// //   const [modalBill, setModalBill] = useState(null);
// //   const [modalMode, setModalMode] = useState(null);
// //   const [confirming, setConfirming] = useState(false);
// //   const [conflictMessage, setConflictMessage] = useState(null);
// //   const [lastRefreshed, setLastRefreshed] = useState(Date.now());
// //   const [searchA, setSearchA] = useState("");
// //   const [searchB, setSearchB] = useState("");
// //   const pollRef = useRef(null);

// //   const refresh = useCallback(async () => {
// //     try {
// //       const bills = await getPendingBills();
// //       setPending(bills);
// //       setLastRefreshed(Date.now());
// //       setLoadError(null);
// //     } catch (err) {
// //       if (err.code === "UNAUTHORIZED") return; // useRequireAuth will redirect
// //       setLoadError(err.message || "Could not load pending bills.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (!user) return;
// //     refresh();
// //     pollRef.current = setInterval(refresh, POLL_MS);
// //     return () => clearInterval(pollRef.current);
// //   }, [user, refresh]);

// //   const { blockA, blockB } = useMemo(() => {
// //     const a = [];
// //     const b = [];
// //     pending.forEach((bill) =>
// //       splitGroup(bill.id) === "A" ? a.push(bill) : b.push(bill),
// //     );
// //     return { blockA: a, blockB: b };
// //   }, [pending]);

// //   if (!ready || !user) return null;

// //   async function openModal(bill, mode) {
// //     setModalBill(bill);
// //     setModalMode(mode);
// //     setConflictMessage(null);

// //     // Best-effort freshness check: re-fetch the pending list right as the
// //     // modal opens. If this bill has vanished from it, someone else already
// //     // approved it since our last poll — surface that immediately instead
// //     // of waiting for the approve call to fail. See README for why this
// //     // (rather than a real lock) is the concurrency approach here.
// //     try {
// //       const fresh = await getPendingBills();
// //       setPending(fresh);
// //       if (!fresh.some((b) => b.id === bill.id)) {
// //         setConflictMessage(
// //           "This bill is no longer pending — it may have just been approved by someone else.",
// //         );
// //       }
// //     } catch (err) {
// //       // If the freshness check itself fails, don't block the operator —
// //       // the approve call below still has its own error handling.
// //     }
// //   }

// //   function closeModal() {
// //     setModalBill(null);
// //     setModalMode(null);
// //     setConflictMessage(null);
// //   }

// // async function handleConfirm(bill, mode) {
// //   setConfirming(true);
// //   try {
// //     if (mode === "reject") {
// //       await rejectBill(bill.id);
// //     } else {
// //       await approveBill(bill.id, mode);
// //     }

// //     setPending((prev) => prev.filter((b) => b.id !== bill.id));

// //     if (mode !== "reject") {
// //       setApprovedThisSession((prev) => [
// //         { ...bill, paymentMode: mode === "cash" ? "Cash" : "UPI", approvedBy: user.name, approvedAt: new Date().toISOString() },
// //         ...prev,
// //       ]);
// //       window.print(); // placeholder for the real thermal-printer trigger
// //     }

// //     closeModal();
// //   } catch (err) {
// //     setConflictMessage(err.message || "Could not process this bill. Try again.");
// //     refresh();
// //   } finally {
// //     setConfirming(false);
// //   }
// // }

// //   const secondsAgo = Math.round((Date.now() - lastRefreshed) / 1000);

// //   return (
// //     <Layout
// //       title="Cash counter — bill approvals"
// //       eyebrow="Cash portal"
// //       actions={
// //         <button className="sf-btn" onClick={refresh}>
// //           <svg
// //             viewBox="0 0 24 24"
// //             fill="none"
// //             stroke="currentColor"
// //             strokeWidth="2"
// //           >
// //             <path d="M23 4v6h-6M1 20v-6h6" />
// //             <path d="M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.65 4.36A9 9 0 0 0 20.5 15" />
// //           </svg>
// //           Refresh
// //         </button>
// //       }
// //     >
// //       <div
// //         style={{
// //           fontSize: 11.5,
// //           color: "var(--ink-faint)",
// //           marginTop: -14,
// //           marginBottom: 16,
// //         }}
// //       >
// //         Updated {secondsAgo <= 1 ? "just now" : `${secondsAgo}s ago`} ·
// //         auto-refreshes every {POLL_MS / 1000}s · pending bills are split into
// //         two counters below so both cashiers can work independently
// //       </div>

// //       <div className="row g-3">
// //         <div className="col-lg-6">
// //           <PendingBlock
// //             label="Counter 1"
// //             bills={blockA}
// //             search={searchA}
// //             onSearchChange={setSearchA}
// //             onApprove={openModal}
// //           />
// //         </div>
// //         <div className="col-lg-6">
// //           <PendingBlock
// //             label="Counter 2"
// //             bills={blockB}
// //             search={searchB}
// //             onSearchChange={setSearchB}
// //             onApprove={openModal}
// //           />
// //         </div>
// //       </div>

// //       {loading && (
// //         <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 12 }}>
// //           Loading...
// //         </div>
// //       )}
// //       {/* {loadError && (
// //         <div style={{ fontSize: 13, color: "var(--danger)", marginTop: 12 }}>
// //           No Bills Found
// //         </div>
// //       )} */}

// //       <div className="sf-panel mt-3">
// //         <div className="sf-panel-title">
// //           Approved this session
// //           <span
// //             style={{
// //               fontWeight: 400,
// //               textTransform: "none",
// //               letterSpacing: 0,
// //               fontSize: 11.5,
// //             }}
// //           >
// //             — resets on page refresh, see README
// //           </span>
// //         </div>
// //         {approvedThisSession.length === 0 && (
// //           <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
// //             Nothing approved yet this session.
// //           </div>
// //         )}
// //         {approvedThisSession.length > 0 && (
// //           <div className="sf-table-wrap">
// //             <table className="sf-table">
// //               <thead>
// //                 <tr>
// //                   <th>Bill No</th>
// //                   <th>Customer</th>
// //                   <th>Amount</th>
// //                   <th>Mode</th>
// //                   <th>By</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {approvedThisSession.map((b) => (
// //                   <tr key={b.id}>
// //                     <td className="mono">{b.billNo}</td>
// //                     <td>{b.customerName}</td>
// //                     <td className="mono">{formatINR(b.grandTotal)}</td>
// //                     <td>
// //                       <span
// //                         className={`sf-status-pill ${b.paymentMode.toLowerCase()}`}
// //                       >
// //                         <span className="dot" />
// //                         {b.paymentMode}
// //                       </span>
// //                     </td>
// //                     <td style={{ fontSize: 12 }}>{b.approvedBy}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}
// //       </div>

// //       <ApprovalModal
// //         bill={modalBill}
// //         mode={modalMode}
// //         onClose={closeModal}
// //         onConfirm={handleConfirm}
// //         confirming={confirming}
// //         conflictMessage={conflictMessage}
// //       />
// //     </Layout>
// //   );
// // }
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Layout from "@/components/Layout/Layout";
// import ApprovalModal from "@/components/CashCounter/ApprovalModal";
// import { useRequireAuth } from "@/context/AuthContext";
// import { getPendingBills, approveBill, rejectBill } from "@/lib/api";
// import { formatINR } from "@/lib/calc";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const POLL_MS =
//   (Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_SECONDS) || 10) * 1000;

// const COMPANY = {
//   name: "SHAMA FIREWORKS INDUSTRIES",
//   // Seller's own GSTIN — fixed, not the per-bill "gst_number" field
//   // (that one is the customer's GSTIN for B2B sales, shown separately).
//   gstin: "27AAMFS0917L1ZT",
// };

// // jsPDF's built-in fonts (Helvetica etc.) don't include the ₹ glyph — it
// // silently renders as a broken box. Using "Rs." keeps it reliable without
// // embedding a custom font.
// function money(amount) {
//   const num = Number(amount || 0);
//   return "Rs. " + num.toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// }

// function formatDate(dateStr) {
//   const d = dateStr ? new Date(dateStr) : new Date();
//   if (isNaN(d.getTime())) return String(dateStr);
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   return `${dd}/${mm}/${d.getFullYear()}`;
// }

// // Normalizes the bill's real line items (from the pending-bills API) into
// // the shape the PDF table needs. "rate" from the API is tax-EXCLUSIVE, so
// // the printed "Rate (Inc. GST)" is derived as total_amount / qty instead.
// function getBillItems(bill) {
//   const raw = bill.items || [];
//   return raw.map((item) => {
//     const qty = Number(item.qty) || 1;
//     const amount = Number(item.totalAmount ?? 0);
//     return {
//       qty,
//       hsn: item.hsnCode ?? "-",
//       particulars: item.productName ?? "-",
//       rateIncGst: Math.round((amount / qty) * 100) / 100,
//       amount,
//     };
//   });
// }

// // Builds the bill PDF from real bill + item data and opens it in a new
// // tab (works fine inside Capacitor's WebView too).
// function generateBillPdf(bill) {
//   const items = getBillItems(bill);
//   const totalAmount = Number(bill.grandTotal) || 0;
//   const taxableAmount = Number(bill.taxableTotal) || 0;
//   const cgst = Number(bill.cgstTotal) || 0;
//   const sgst = Number(bill.sgstTotal) || 0;

//   const tokenNumber = bill.tokenNumber;
//   const customerMobile = bill.customerMobile;
//   const customerGstin = bill.gstNumber;
//   const isWalkIn = !bill.customerName || /walk[\s-]?in/i.test(bill.customerName);

//   const doc = new jsPDF({ unit: "pt", format: "a4" });
//   const marginX = 40;
//   const pageWidth = doc.internal.pageSize.getWidth();
//   let y = 50;

//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(16);
//   doc.text(COMPANY.name, marginX, y);

//   if (tokenNumber) {
//     doc.setFontSize(12);
//     doc.text(`Token #${tokenNumber}`, pageWidth - marginX, y, { align: "right" });
//   }
//   y += 22;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(10.5);
//   doc.text(`GSTIN: ${COMPANY.gstin}`, marginX, y);
//   y += 20;

//   doc.setFont("helvetica", "bold");
//   doc.text("Bill No:", marginX, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(String(bill.billNo || "-"), marginX + 52, y);

//   doc.setFont("helvetica", "bold");
//   doc.text("Date:", marginX + 260, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(formatDate(bill.submittedAt), marginX + 300, y);
//   y += 20;

//   doc.setFont("helvetica", "bold");
//   doc.text("Customer Name:", marginX, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(isWalkIn ? "-" : String(bill.customerName), marginX + 108, y);
//   y += 18;

//   if (customerMobile) {
//     doc.setFont("helvetica", "bold");
//     doc.text("Mobile:", marginX, y);
//     doc.setFont("helvetica", "normal");
//     doc.text(String(customerMobile), marginX + 58, y);
//     y += 18;
//   }

//   if (customerGstin) {
//     doc.setFont("helvetica", "bold");
//     doc.text("Customer GSTIN:", marginX, y);
//     doc.setFont("helvetica", "normal");
//     doc.text(String(customerGstin), marginX + 112, y);
//     y += 18;
//   }

//   doc.setFont("helvetica", "bold");
//   doc.text("Sales Person:", marginX, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(String(bill.salesPerson || "-"), marginX + 100, y);
//   y += 22;

//   autoTable(doc, {
//     startY: y,
//     margin: { left: marginX, right: marginX },
//     head: [["Qty", "HSN", "Particulars", "Rate (Inc. GST)", "Amount"]],
//     body: items.map((it) => [
//       String(it.qty),
//       it.hsn,
//       it.particulars,
//       money(it.rateIncGst).replace("Rs. ", ""),
//       money(it.amount).replace("Rs. ", ""),
//     ]),
//     theme: "grid",
//     styles: { font: "helvetica", fontSize: 10, cellPadding: 6, textColor: [20, 20, 20] },
//     headStyles: {
//       fillColor: [245, 245, 245],
//       textColor: [20, 20, 20],
//       fontStyle: "bold",
//       lineColor: [220, 220, 220],
//       lineWidth: 0.5,
//     },
//     bodyStyles: { lineColor: [230, 230, 230], lineWidth: 0.5 },
//     columnStyles: {
//       0: { cellWidth: 32, halign: "center" },
//       1: { cellWidth: 60, halign: "center" },
//       3: { halign: "right" },
//       4: { halign: "right" },
//     },
//   });

//   y = doc.lastAutoTable.finalY + 26;

//   doc.setFontSize(11);
//   [
//     ["Total Amount", money(totalAmount)],
//     ["Taxable Amount", money(taxableAmount)],
//     ["CGST", money(cgst)],
//     ["SGST", money(sgst)],
//   ].forEach(([label, value]) => {
//     doc.setFont("helvetica", "bold");
//     doc.text(label, marginX, y);
//     doc.setFont("helvetica", "normal");
//     doc.text(`: ${value}`, marginX + 150, y);
//     y += 18;
//   });

//   y += 8;
//   doc.setFontSize(13);
//   doc.setFont("helvetica", "bold");
//   doc.text("Grand Total", marginX, y);
//   doc.text(`: ${money(totalAmount)}`, marginX + 150, y);
//   y += 28;

//   doc.setFontSize(11);
//   doc.setFont("helvetica", "bold");
//   doc.text("Payment Mode:", marginX, y);
//   doc.setFont("helvetica", "normal");
//   doc.text(String(bill.paymentMode || "-").toUpperCase(), marginX + 104, y);
//   y += 22;

//   doc.setFont("helvetica", "italic");
//   doc.setFontSize(9.5);
//   doc.setTextColor(110, 110, 110);
//   doc.text("Rates are inclusive of GST", marginX, y);
//   doc.setTextColor(0, 0, 0);

//   const blobUrl = doc.output("bloburl");
//   window.open(blobUrl, "_blank");
// }

// function timeAgo(iso) {
//   const mins = Math.max(
//     1,
//     Math.round((Date.now() - new Date(iso).getTime()) / 60000),
//   );
//   if (mins < 60) return `${mins} min ago`;
//   return `${Math.round(mins / 60)} hr ago`;
// }

// // Stable pseudo-random split — a bill always lands in the same block on
// // every render/poll (hashed from its id), rather than jumping between
// // blocks each refresh, which would be confusing to work against.
// function splitGroup(id) {
//   const str = String(id);
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
//   }
//   return hash % 2 === 0 ? "A" : "B";
// }

// function matchesSearch(bill, query) {
//   if (!query.trim()) return true;
//   const q = query.trim().toLowerCase();
//   const token = String(bill.tokenNumber ?? "");
//   return (
//     bill.billNo.toLowerCase().includes(q) ||
//     bill.customerName.toLowerCase().includes(q) ||
//     token.toLowerCase().includes(q)
//   );
// }

// function PendingBlock({ label, bills, search, onSearchChange, onApprove }) {
//   const filtered = bills.filter((b) => matchesSearch(b, search));

//   return (
//     <div className="sf-panel">
//       <div className="sf-panel-title">
//         {label} ({bills.length})
//       </div>

//       <div className="sf-search-bar mb-3">
//         <svg
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <circle cx="11" cy="11" r="7" />
//           <path d="M21 21l-4.3-4.3" />
//         </svg>
//         <input
//           placeholder="Search bill no., customer, or token"
//           value={search}
//           onChange={(e) => onSearchChange(e.target.value)}
//         />
//       </div>

//       {bills.length === 0 && (
//         <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
//           No bills waiting right now.
//         </div>
//       )}
//       {bills.length > 0 && filtered.length === 0 && (
//         <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
//           No bills match &quot;{search}&quot;.
//         </div>
//       )}

//       {filtered.map((b) => {
//         const token = b.tokenNumber;
//         return (
//           <div key={b.id} className="sf-queue-row">
//             <div className="sf-qinfo">
//               <div className="sf-qbill">
//                 {b.billNo}
//                 {token && (
//                   <span
//                     style={{
//                       marginLeft: 8,
//                       fontSize: 11,
//                       fontWeight: 700,
//                       color: "var(--brand, #b45309)",
//                       background: "var(--brand-soft, #fff3e0)",
//                       borderRadius: 6,
//                       padding: "1px 7px",
//                     }}
//                   >
//                     #{token}
//                   </span>
//                 )}
//               </div>
//               <div className="sf-qcust">{b.customerName}</div>
//               <div className="sf-qsub">
//                 {b.salesPerson} · {b.itemCount} item{b.itemCount === 1 ? "" : "s"}{" "}
//                 · submitted {timeAgo(b.submittedAt)}
//               </div>
//             </div>
//             <div className="sf-qamt">{formatINR(b.grandTotal)}</div>
//             <div className="d-flex gap-2">
//               <button
//                 className="sf-btn sf-btn-cash sf-btn-sm"
//                 onClick={() => onApprove(b, "cash")}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <rect x="2" y="6" width="20" height="12" rx="2" />
//                   <circle cx="12" cy="12" r="2.5" />
//                 </svg>
//                 Cash
//               </button>
//               <button
//                 className="sf-btn sf-btn-upi sf-btn-sm"
//                 onClick={() => onApprove(b, "upi")}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <rect x="4" y="2" width="16" height="20" rx="2" />
//                   <path d="M8 6h8M8 18h.01" />
//                 </svg>
//                 UPI
//               </button>
//               <button
//                 className="sf-btn sf-btn-reject sf-btn-sm"
//                 onClick={() => onApprove(b, "reject")}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M18 6L6 18M6 6l12 12" />
//                 </svg>
//                 Reject
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default function CashCounterPage() {
//   const { user, ready } = useRequireAuth();
//   const [pending, setPending] = useState([]);
//   const [approvedThisSession, setApprovedThisSession] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [modalBill, setModalBill] = useState(null);
//   const [modalMode, setModalMode] = useState(null);
//   const [confirming, setConfirming] = useState(false);
//   const [conflictMessage, setConflictMessage] = useState(null);
//   const [lastRefreshed, setLastRefreshed] = useState(Date.now());
//   const [searchA, setSearchA] = useState("");
//   const [searchB, setSearchB] = useState("");
//   const pollRef = useRef(null);

//   const refresh = useCallback(async () => {
//     try {
//       const bills = await getPendingBills();
//       setPending(bills);
//       setLastRefreshed(Date.now());
//       setLoadError(null);
//     } catch (err) {
//       if (err.code === "UNAUTHORIZED") return; // useRequireAuth will redirect
//       setLoadError(err.message || "Could not load pending bills.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     refresh();
//     pollRef.current = setInterval(refresh, POLL_MS);
//     return () => clearInterval(pollRef.current);
//   }, [user, refresh]);

//   const { blockA, blockB } = useMemo(() => {
//     const a = [];
//     const b = [];
//     pending.forEach((bill) =>
//       splitGroup(bill.id) === "A" ? a.push(bill) : b.push(bill),
//     );
//     return { blockA: a, blockB: b };
//   }, [pending]);

//   if (!ready || !user) return null;

//   async function openModal(bill, mode) {
//     setModalBill(bill);
//     setModalMode(mode);
//     setConflictMessage(null);

//     // Best-effort freshness check: re-fetch the pending list right as the
//     // modal opens. If this bill has vanished from it, someone else already
//     // approved it since our last poll — surface that immediately instead
//     // of waiting for the approve call to fail. See README for why this
//     // (rather than a real lock) is the concurrency approach here.
//     try {
//       const fresh = await getPendingBills();
//       setPending(fresh);
//       if (!fresh.some((b) => b.id === bill.id)) {
//         setConflictMessage(
//           "This bill is no longer pending — it may have just been approved by someone else.",
//         );
//       }
//     } catch (err) {
//       // If the freshness check itself fails, don't block the operator —
//       // the approve call below still has its own error handling.
//     }
//   }

//   function closeModal() {
//     setModalBill(null);
//     setModalMode(null);
//     setConflictMessage(null);
//   }

//   async function handleConfirm(bill, mode) {
//     setConfirming(true);
//     try {
//       if (mode === "reject") {
//         await rejectBill(bill.id);
//       } else {
//         await approveBill(bill.id, mode);
//       }

//       setPending((prev) => prev.filter((b) => b.id !== bill.id));

//       if (mode !== "reject") {
//         setApprovedThisSession((prev) => [
//           {
//             ...bill,
//             paymentMode: mode === "cash" ? "Cash" : "UPI",
//             approvedBy: user.name,
//             approvedAt: new Date().toISOString(),
//           },
//           ...prev,
//         ]);

//         // Real bill PDF built from the bill's actual items/token/GST data.
//         generateBillPdf({ ...bill, paymentMode: mode });
//       }

//       closeModal();
//     } catch (err) {
//       setConflictMessage(err.message || "Could not process this bill. Try again.");
//       refresh();
//     } finally {
//       setConfirming(false);
//     }
//   }

//   const secondsAgo = Math.round((Date.now() - lastRefreshed) / 1000);

//   return (
//     <Layout
//       title="Cash counter — bill approvals"
//       eyebrow="Cash portal"
//       actions={
//         <button className="sf-btn" onClick={refresh}>
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path d="M23 4v6h-6M1 20v-6h6" />
//             <path d="M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.65 4.36A9 9 0 0 0 20.5 15" />
//           </svg>
//           Refresh
//         </button>
//       }
//     >
//       <div
//         style={{
//           fontSize: 11.5,
//           color: "var(--ink-faint)",
//           marginTop: -14,
//           marginBottom: 16,
//         }}
//       >
//         Updated {secondsAgo <= 1 ? "just now" : `${secondsAgo}s ago`} ·
//         auto-refreshes every {POLL_MS / 1000}s · pending bills are split into
//         two counters below so both cashiers can work independently
//       </div>

//       <div className="row g-3">
//         <div className="col-lg-6">
//           <PendingBlock
//             label="Counter 1"
//             bills={blockA}
//             search={searchA}
//             onSearchChange={setSearchA}
//             onApprove={openModal}
//           />
//         </div>
//         <div className="col-lg-6">
//           <PendingBlock
//             label="Counter 2"
//             bills={blockB}
//             search={searchB}
//             onSearchChange={setSearchB}
//             onApprove={openModal}
//           />
//         </div>
//       </div>

//       {loading && (
//         <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 12 }}>
//           Loading...
//         </div>
//       )}
//       {/* {loadError && (
//         <div style={{ fontSize: 13, color: "var(--danger)", marginTop: 12 }}>
//           No Bills Found
//         </div>
//       )} */}

//       <div className="sf-panel mt-3">
//         <div className="sf-panel-title">
//           Approved this session
//           <span
//             style={{
//               fontWeight: 400,
//               textTransform: "none",
//               letterSpacing: 0,
//               fontSize: 11.5,
//             }}
//           >
//             — resets on page refresh, see README
//           </span>
//         </div>
//         {approvedThisSession.length === 0 && (
//           <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
//             Nothing approved yet this session.
//           </div>
//         )}
//         {approvedThisSession.length > 0 && (
//           <div className="sf-table-wrap">
//             <table className="sf-table">
//               <thead>
//                 <tr>
//                   <th>Bill No</th>
//                   <th>Customer</th>
//                   <th>Amount</th>
//                   <th>Mode</th>
//                   <th>By</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {approvedThisSession.map((b) => (
//                   <tr key={b.id}>
//                     <td className="mono">{b.billNo}</td>
//                     <td>{b.customerName}</td>
//                     <td className="mono">{formatINR(b.grandTotal)}</td>
//                     <td>
//                       <span
//                         className={`sf-status-pill ${b.paymentMode.toLowerCase()}`}
//                       >
//                         <span className="dot" />
//                         {b.paymentMode}
//                       </span>
//                     </td>
//                     <td style={{ fontSize: 12 }}>{b.approvedBy}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <ApprovalModal
//         bill={modalBill}
//         mode={modalMode}
//         onClose={closeModal}
//         onConfirm={handleConfirm}
//         confirming={confirming}
//         conflictMessage={conflictMessage}
//       />
//     </Layout>
//   );
// }
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import Layout from "@/components/Layout/Layout";
// import ApprovalModal from "@/components/CashCounter/ApprovalModal";
// import { useThermalPrint } from "@/components/CashCounter/ThermalReceipt";
// import { useRequireAuth } from "@/context/AuthContext";
// import { getPendingBills, approveBill, rejectBill } from "@/lib/api";
// import { formatINR } from "@/lib/calc";

// const POLL_MS =
//   (Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_SECONDS) || 10) * 1000;

// function timeAgo(iso) {
//   const mins = Math.max(
//     1,
//     Math.round((Date.now() - new Date(iso).getTime()) / 60000),
//   );
//   if (mins < 60) return `${mins} min ago`;
//   return `${Math.round(mins / 60)} hr ago`;
// }

// // Stable pseudo-random split — a bill always lands in the same block on
// // every render/poll (hashed from its id), rather than jumping between
// // blocks each refresh, which would be confusing to work against.
// function splitGroup(id) {
//   const str = String(id);
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
//   }
//   return hash % 2 === 0 ? "A" : "B";
// }

// function matchesSearch(bill, query) {
//   if (!query.trim()) return true;
//   const q = query.trim().toLowerCase();
//   const token = String(bill.tokenNumber ?? "");
//   return (
//     bill.billNo.toLowerCase().includes(q) ||
//     bill.customerName.toLowerCase().includes(q) ||
//     token.toLowerCase().includes(q)
//   );
// }

// function PendingBlock({ label, bills, search, onSearchChange, onApprove }) {
//   const filtered = bills.filter((b) => matchesSearch(b, search));

//   return (
//     <div className="sf-panel">
//       <div className="sf-panel-title">
//         {label} ({bills.length})
//       </div>

//       <div className="sf-search-bar mb-3">
//         <svg
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//         >
//           <circle cx="11" cy="11" r="7" />
//           <path d="M21 21l-4.3-4.3" />
//         </svg>
//         <input
//           placeholder="Search bill no., customer, or token"
//           value={search}
//           onChange={(e) => onSearchChange(e.target.value)}
//         />
//       </div>

//       {bills.length === 0 && (
//         <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
//           No bills waiting right now.
//         </div>
//       )}
//       {bills.length > 0 && filtered.length === 0 && (
//         <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
//           No bills match &quot;{search}&quot;.
//         </div>
//       )}

//       {filtered.map((b) => {
//         const token = b.tokenNumber;
//         return (
//           <div key={b.id} className="sf-queue-row">
//             <div className="sf-qinfo">
//               <div className="sf-qbill">
//                 {b.billNo}
//                 {token && (
//                   <span
//                     style={{
//                       marginLeft: 8,
//                       fontSize: 11,
//                       fontWeight: 700,
//                       color: "var(--brand, #b45309)",
//                       background: "var(--brand-soft, #fff3e0)",
//                       borderRadius: 6,
//                       padding: "1px 7px",
//                     }}
//                   >
//                     #{token}
//                   </span>
//                 )}
//               </div>
//               <div className="sf-qcust">{b.customerName}</div>
//               <div className="sf-qsub">
//                 {b.salesPerson} · {b.itemCount} item{b.itemCount === 1 ? "" : "s"}{" "}
//                 · submitted {timeAgo(b.submittedAt)}
//               </div>
//             </div>
//             <div className="sf-qamt">{formatINR(b.grandTotal)}</div>
//             <div className="d-flex gap-2">
//               <button
//                 className="sf-btn sf-btn-cash sf-btn-sm"
//                 onClick={() => onApprove(b, "cash")}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <rect x="2" y="6" width="20" height="12" rx="2" />
//                   <circle cx="12" cy="12" r="2.5" />
//                 </svg>
//                 Cash
//               </button>
//               <button
//                 className="sf-btn sf-btn-upi sf-btn-sm"
//                 onClick={() => onApprove(b, "upi")}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <rect x="4" y="2" width="16" height="20" rx="2" />
//                   <path d="M8 6h8M8 18h.01" />
//                 </svg>
//                 UPI
//               </button>
//               <button
//                 className="sf-btn sf-btn-reject sf-btn-sm"
//                 onClick={() => onApprove(b, "reject")}
//               >
//                 <svg
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 >
//                   <path d="M18 6L6 18M6 6l12 12" />
//                 </svg>
//                 Reject
//               </button>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// export default function CashCounterPage() {
//   const { user, ready } = useRequireAuth();
//   const [pending, setPending] = useState([]);
//   const [approvedThisSession, setApprovedThisSession] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [modalBill, setModalBill] = useState(null);
//   const [modalMode, setModalMode] = useState(null);
//   const [confirming, setConfirming] = useState(false);
//   const [conflictMessage, setConflictMessage] = useState(null);
//   const [lastRefreshed, setLastRefreshed] = useState(Date.now());
//   const [searchA, setSearchA] = useState("");
//   const [searchB, setSearchB] = useState("");
//   const pollRef = useRef(null);

//   // Thermal-printer receipt (80mm) — printBill(bill) triggers window.print()
//   // against a hidden print-only receipt; ReceiptPortal renders that receipt.
//   const { printBill, ReceiptPortal } = useThermalPrint();

//   const refresh = useCallback(async () => {
//     try {
//       const bills = await getPendingBills();
//       setPending(bills);
//       setLastRefreshed(Date.now());
//       setLoadError(null);
//     } catch (err) {
//       if (err.code === "UNAUTHORIZED") return; // useRequireAuth will redirect
//       setLoadError(err.message || "Could not load pending bills.");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     refresh();
//     pollRef.current = setInterval(refresh, POLL_MS);
//     return () => clearInterval(pollRef.current);
//   }, [user, refresh]);

//   const { blockA, blockB } = useMemo(() => {
//     const a = [];
//     const b = [];
//     pending.forEach((bill) =>
//       splitGroup(bill.id) === "A" ? a.push(bill) : b.push(bill),
//     );
//     return { blockA: a, blockB: b };
//   }, [pending]);

//   if (!ready || !user) return null;

//   async function openModal(bill, mode) {
//     setModalBill(bill);
//     setModalMode(mode);
//     setConflictMessage(null);

//     // Best-effort freshness check: re-fetch the pending list right as the
//     // modal opens. If this bill has vanished from it, someone else already
//     // approved it since our last poll — surface that immediately instead
//     // of waiting for the approve call to fail. See README for why this
//     // (rather than a real lock) is the concurrency approach here.
//     try {
//       const fresh = await getPendingBills();
//       setPending(fresh);
//       if (!fresh.some((b) => b.id === bill.id)) {
//         setConflictMessage(
//           "This bill is no longer pending — it may have just been approved by someone else.",
//         );
//       }
//     } catch (err) {
//       // If the freshness check itself fails, don't block the operator —
//       // the approve call below still has its own error handling.
//     }
//   }

//   function closeModal() {
//     setModalBill(null);
//     setModalMode(null);
//     setConflictMessage(null);
//   }

//   async function handleConfirm(bill, mode) {
//     setConfirming(true);
//     try {
//       if (mode === "reject") {
//         await rejectBill(bill.id);
//       } else {
//         await approveBill(bill.id, mode);
//       }

//       setPending((prev) => prev.filter((b) => b.id !== bill.id));

//       if (mode !== "reject") {
//         setApprovedThisSession((prev) => [
//           {
//             ...bill,
//             paymentMode: mode === "cash" ? "Cash" : "UPI",
//             approvedBy: user.name,
//             approvedAt: new Date().toISOString(),
//           },
//           ...prev,
//         ]);

//         // Sends the bill to the thermal-print receipt (opens the browser
//         // print dialog against the connected 80mm/3" printer) instead of
//         // downloading a PDF.
//         printBill({ ...bill, paymentMode: mode });
//       }

//       closeModal();
//     } catch (err) {
//       setConflictMessage(err.message || "Could not process this bill. Try again.");
//       refresh();
//     } finally {
//       setConfirming(false);
//     }
//   }

//   const secondsAgo = Math.round((Date.now() - lastRefreshed) / 1000);

//   return (
//     <Layout
//       title="Cash counter — bill approvals"
//       eyebrow="Cash portal"
//       actions={
//         <button className="sf-btn" onClick={refresh}>
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//           >
//             <path d="M23 4v6h-6M1 20v-6h6" />
//             <path d="M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.65 4.36A9 9 0 0 0 20.5 15" />
//           </svg>
//           Refresh
//         </button>
//       }
//     >
//       <div
//         style={{
//           fontSize: 11.5,
//           color: "var(--ink-faint)",
//           marginTop: -14,
//           marginBottom: 16,
//         }}
//       >
//         Updated {secondsAgo <= 1 ? "just now" : `${secondsAgo}s ago`} ·
//         auto-refreshes every {POLL_MS / 1000}s · pending bills are split into
//         two counters below so both cashiers can work independently
//       </div>

//       <div className="row g-3">
//         <div className="col-lg-6">
//           <PendingBlock
//             label="Counter 1"
//             bills={blockA}
//             search={searchA}
//             onSearchChange={setSearchA}
//             onApprove={openModal}
//           />
//         </div>
//         <div className="col-lg-6">
//           <PendingBlock
//             label="Counter 2"
//             bills={blockB}
//             search={searchB}
//             onSearchChange={setSearchB}
//             onApprove={openModal}
//           />
//         </div>
//       </div>

//       {loading && (
//         <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 12 }}>
//           Loading...
//         </div>
//       )}
//       {/* {loadError && (
//         <div style={{ fontSize: 13, color: "var(--danger)", marginTop: 12 }}>
//           No Bills Found
//         </div>
//       )} */}

//       <div className="sf-panel mt-3">
//         <div className="sf-panel-title">
//           Approved this session
//           <span
//             style={{
//               fontWeight: 400,
//               textTransform: "none",
//               letterSpacing: 0,
//               fontSize: 11.5,
//             }}
//           >
//             — resets on page refresh, see README
//           </span>
//         </div>
//         {approvedThisSession.length === 0 && (
//           <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
//             Nothing approved yet this session.
//           </div>
//         )}
//         {approvedThisSession.length > 0 && (
//           <div className="sf-table-wrap">
//             <table className="sf-table">
//               <thead>
//                 <tr>
//                   <th>Bill No</th>
//                   <th>Customer</th>
//                   <th>Amount</th>
//                   <th>Mode</th>
//                   <th>By</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {approvedThisSession.map((b) => (
//                   <tr key={b.id}>
//                     <td className="mono">{b.billNo}</td>
//                     <td>{b.customerName}</td>
//                     <td className="mono">{formatINR(b.grandTotal)}</td>
//                     <td>
//                       <span
//                         className={`sf-status-pill ${b.paymentMode.toLowerCase()}`}
//                       >
//                         <span className="dot" />
//                         {b.paymentMode}
//                       </span>
//                     </td>
//                     <td style={{ fontSize: 12 }}>{b.approvedBy}</td>
//                     <td>
//                       <button
//                         className="sf-btn sf-btn-sm"
//                         onClick={() => printBill(b)}
//                         title="Reprint receipt"
//                       >
//                         Reprint
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <ApprovalModal
//         bill={modalBill}
//         mode={modalMode}
//         onClose={closeModal}
//         onConfirm={handleConfirm}
//         confirming={confirming}
//         conflictMessage={conflictMessage}
//       />

//       {ReceiptPortal}
//     </Layout>
//   );
// }
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import ApprovalModal from "@/components/CashCounter/ApprovalModal";
import { useThermalPrint } from "@/components/CashCounter/ThermalReceipt";
import { useRequireAuth } from "@/context/AuthContext";
import { getPendingBills, approveBill, rejectBill, updateBill } from "@/lib/api";
import { formatINR } from "@/lib/calc";

const POLL_MS =
  (Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_SECONDS) || 10) * 1000;

function timeAgo(iso) {
  const mins = Math.max(
    1,
    Math.round((Date.now() - new Date(iso).getTime()) / 60000),
  );
  if (mins < 60) return `${mins} min ago`;
  return `${Math.round(mins / 60)} hr ago`;
}

function splitGroup(id) {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % 2 === 0 ? "A" : "B";
}

// Bills are routed to a shop tab purely by their bill-number prefix —
// "SFA..." belongs to Shop AKR, "SFR..." belongs to Shop 14-15.
const SHOP_TABS = [
  { key: "SFA", label: "Shop AKR" },
  { key: "SFR", label: "Shop 14-15" },
];

// Bill numbers aren't always written as a clean "SFR001" prefix — some
// come through as "SF/R/001" or "SF-R-001" — so strip anything that isn't
// a letter/digit before checking the prefix, letting "SFR" match all of
// those variants alike.
function matchesShop(bill, shopKey) {
  const normalized = String(bill.billNo || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  return normalized.startsWith(shopKey);
}

function matchesSearch(bill, query) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const token = String(bill.tokenNumber ?? "");
  return (
    bill.billNo.toLowerCase().includes(q) ||
    bill.customerName.toLowerCase().includes(q) ||
    token.toLowerCase().includes(q)
  );
}

// ---------- Update bill API ----------
// async function updateBill(billId, payload) {
//   const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
//   const token = localStorage.getItem("sf_cash_token");
//   const res = await fetch(`${base}/api/sales/bills/${billId}`, {
//     method: "PATCH",
//     headers: {
//   "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),  // ← ADD THIS
//     },
//     body: JSON.stringify(payload),
//   });

//   if (!res.ok) {
//     const err = await res.json().catch(() => ({}));
//     throw new Error(err.message || "Failed to update bill");
//   }
//   return res.json();
// }

function PendingBlock({ label, bills, search, onSearchChange, onApprove }) {
  const filtered = bills.filter((b) => matchesSearch(b, search));

  return (
    <div className="sf-panel">
      <div className="sf-panel-title">
        {label} ({bills.length})
      </div>

      <div className="sf-search-bar mb-3">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          placeholder="Search bill no., customer, or token"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {bills.length === 0 && (
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          No bills waiting right now.
        </div>
      )}
      {bills.length > 0 && filtered.length === 0 && (
        <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
          No bills match &quot;{search}&quot;.
        </div>
      )}

      {filtered.map((b) => {
        const token = b.tokenNumber;
        return (
          <div key={b.id} className="sf-queue-row">
            <div className="sf-qinfo">
              <div className="sf-qbill">
                {b.billNo}
                {token && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--brand, #b45309)",
                      background: "var(--brand-soft, #fff3e0)",
                      borderRadius: 6,
                      padding: "1px 7px",
                    }}
                  >
                    #{token}
                  </span>
                )}
              </div>
              <div className="sf-qcust">{b.customerName}</div>
              <div className="sf-qsub">
                {b.salesPerson} · {b.itemCount} item{b.itemCount === 1 ? "" : "s"} ·
                submitted {timeAgo(b.submittedAt)}
              </div>
            </div>
            <div className="sf-qamt">{formatINR(b.grandTotal)}</div>
            <div className="d-flex gap-2 sf-qactions">
              <button
                className="sf-btn sf-btn-cash sf-btn-sm"
                onClick={() => onApprove(b, "cash")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>
                Approve
              </button>
              <button
                className="sf-btn sf-btn-reject sf-btn-sm"
                onClick={() => onApprove(b, "reject")}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
                Reject
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}

export default function CashCounterPage() {
  const { user, ready } = useRequireAuth();
  console.log(ready,"asdasd")
  const [pending, setPending] = useState([]);
  const [approvedThisSession, setApprovedThisSession] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalBill, setModalBill] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [conflictMessage, setConflictMessage] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());
  const [activeShop, setActiveShop] = useState(SHOP_TABS[0].key);
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const pollRef = useRef(null);

  const { printBill, ReceiptPortal } = useThermalPrint();

  const refresh = useCallback(async () => {
    try {
      const bills = await getPendingBills();
      setPending(bills);
      setLastRefreshed(Date.now());
      setLoadError(null);
    } catch (err) {
      if (err.code === "UNAUTHORIZED") return;
      setLoadError(err.message || "Could not load pending bills.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    refresh();
    pollRef.current = setInterval(refresh, POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [user, refresh]);

  const { blockA, blockB } = useMemo(() => {
    const a = [];
    const b = [];
    pending
      .filter((bill) => matchesShop(bill, activeShop))
      .forEach((bill) =>
        splitGroup(bill.id) === "A" ? a.push(bill) : b.push(bill),
      );
    return { blockA: a, blockB: b };
  }, [pending, activeShop]);

  const visibleApproved = useMemo(
    () => approvedThisSession.filter((b) => matchesShop(b, activeShop)),
    [approvedThisSession, activeShop],
  );

  if (!ready || !user) return null;

  async function openModal(bill, mode) {
    setModalBill(bill);
    setModalMode(mode);
    setConflictMessage(null);

    try {
      const fresh = await getPendingBills();
      setPending(fresh);
      if (!fresh.some((b) => b.id === bill.id)) {
        setConflictMessage(
          "This bill is no longer pending — it may have just been approved by someone else.",
        );
      }
    } catch (err) {
      // ignore freshness check failure
    }
  }

  function closeModal() {
    setModalBill(null);
    setModalMode(null);
    setConflictMessage(null);
  }

  // async function handleConfirm(bill, mode, payload = {}) {
  //   setConfirming(true);
  //   try {
  //     if (mode === "reject") {
  //       await rejectBill(bill.id);
  //     } else {
  //       // 1. Update bill (customer, GSTIN, discount, rounded values)
  //       await updateBill(bill.id, {
  //         customerName: payload.customerName,
  //         gstNumber: payload.gstNumber,
  //         discount_amount: payload.discount_amount,
  //         grandTotal: payload.grandTotal,
  //         round_off_amount: payload.round_off_amount,
  //         paymentMode: mode,
  //       });

  //       // 2. Approve (remove this line if your PATCH already marks it approved)
  //       await approveBill(bill.id, mode);
  //     }

  //     setPending((prev) => prev.filter((b) => b.id !== bill.id));

  //     if (mode !== "reject") {
  //       const finalBill = {
  //         ...bill,
  //         customerName: payload.customerName ?? bill.customerName,
  //         gstNumber: payload.gstNumber ?? bill.gstNumber,
  //         grandTotal: payload.grandTotal ?? bill.grandTotal,
  //         discount_amount: payload.discount_amount ?? 0,
  //         discountTotal: payload.discount_amount ?? 0, // for thermal receipt
  //         discount: payload.discount_amount ?? 0,      // for thermal receipt
  //         round_off_amount: payload.round_off_amount ?? 0,
  //         paymentMode:
  //           mode === "cash" ? "Cash" : mode === "upi" ? "UPI" : "Credit",
  //         approvedBy: user.name,
  //         approvedAt: new Date().toISOString(),
  //       };

  //       setApprovedThisSession((prev) => [finalBill, ...prev]);
  //       printBill(finalBill);
  //     }

  //     closeModal();
  //   } catch (err) {
  //     setConflictMessage(err.message || "Could not process this bill. Try again.");
  //     refresh();
  //   } finally {
  //     setConfirming(false);
  //   }
  // }


async function handleConfirm(bill, mode, payload = {}) {
  setConfirming(true);
  try {
    if (mode === "reject") {
      await rejectBill(bill.id);
    } else {
      // Only approve (update already done if needed)
      await approveBill(bill.id, mode);
    }

    setPending((prev) => prev.filter((b) => b.id !== bill.id));

    if (mode !== "reject") {
      const finalBill = {
        ...bill,
        customerName: payload.customerName ?? bill.customerName,
        gstNumber: payload.gstNumber ?? bill.gstNumber,
        grandTotal: payload.grandTotal ?? bill.grandTotal,
        discount_amount: payload.discount_amount ?? 0,
        discountTotal: payload.discount_amount ?? 0,
        discount: payload.discount_amount ?? 0,
        taxableTotal: payload.taxable_amount ?? bill.taxableTotal,
        cgstTotal: payload.cgst_amount ?? bill.cgstTotal,
        sgstTotal: payload.sgst_amount ?? bill.sgstTotal,
        round_off_amount: payload.round_off_amount ?? 0,
        paymentMode:
          mode === "cash"
            ? "Cash"
            : mode === "upi"
              ? "UPI"
              : mode === "cash_upi"
                ? "Cash + UPI"
                : "Credit",
        approvedBy: user.name,
        approvedAt: new Date().toISOString(),
        total_cash: payload.total_cash,   // ← add
  total_upi: payload.total_upi,
      };

      setApprovedThisSession((prev) => [finalBill, ...prev]);
      printBill(finalBill);
    }

    closeModal();
  } catch (err) {
    setConflictMessage(err.message || "Could not process this bill. Try again.");
    refresh();
  } finally {
    setConfirming(false);
  }
}

async function handleUpdate(bill, payload) {
  setConfirming(true); // or use a separate updating state if you prefer
  try {
    await updateBill(bill.id, {
      customerName: payload.customerName,
      gstNumber: payload.gstNumber,
      discount_amount: payload.discount_amount,
      taxable_amount: payload.taxable_amount,
      cgst_amount: payload.cgst_amount,
      sgst_amount: payload.sgst_amount,
      grandTotal: payload.grandTotal,
      round_off_amount: payload.round_off_amount,
      paymentMode: payload.paymentMode,
      total_cash: payload.total_cash,   // ← add
  total_upi: payload.total_upi,
    });
    // success → modal will set hasUpdated = true
  } catch (err) {
    setConflictMessage(err.message || "Could not update this bill.");
    throw err; // so modal knows it failed
  } finally {
    setConfirming(false);
  }
}

  const secondsAgo = Math.round((Date.now() - lastRefreshed) / 1000);

  return (
    <Layout
      title="Cash counter — bill approvals"
      eyebrow="Cash portal"
      actions={
        <button className="sf-btn" onClick={refresh}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.5 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.65 4.36A9 9 0 0 0 20.5 15" />
          </svg>
          Refresh
        </button>
      }
    >
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {SHOP_TABS.map((shop) => {
          const isActive = activeShop === shop.key;
          return (
            <button
              key={shop.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveShop(shop.key)}
              style={{
                border: "none",
                cursor: "pointer",
                padding: "9px 20px",
                borderRadius: 8,
                fontSize: 13.5,
                fontWeight: 700,
                color: "#fff",
                background: isActive ? "#6d28d9" : "#a78bfa",
                opacity: isActive ? 1 : 0.85,
                boxShadow: isActive ? "0 2px 8px rgba(109, 40, 217, 0.35)" : "none",
              }}
            >
              {shop.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 11.5,
          color: "var(--ink-faint)",
          marginTop: -8,
          marginBottom: 16,
        }}
      >
        Updated {secondsAgo <= 1 ? "just now" : `${secondsAgo}s ago`} · auto-refreshes
        every {POLL_MS / 1000}s · pending bills are split into two counters below so
        both cashiers can work independently
      </div>

      <div className="row g-3">
        <div className="col-lg-6">
          <PendingBlock
            label="Counter 1"
            bills={blockA}
            search={searchA}
            onSearchChange={setSearchA}
            onApprove={openModal}
          />
        </div>
        <div className="col-lg-6">
          <PendingBlock
            label="Counter 2"
            bills={blockB}
            search={searchB}
            onSearchChange={setSearchB}
            onApprove={openModal}
          />
        </div>
      </div>

      {loading && (
        <div style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 12 }}>
          Loading...
        </div>
      )}

      <div className="sf-panel mt-3">
        <div className="sf-panel-title">
          Approved this session
          <span
            style={{
              fontWeight: 400,
              textTransform: "none",
              letterSpacing: 0,
              fontSize: 11.5,
            }}
          >
            — resets on page refresh, see README
          </span>
        </div>
        {visibleApproved.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            Nothing approved yet this session.
          </div>
        )}
        {visibleApproved.length > 0 && (
          <div className="sf-table-wrap">
            <table className="sf-table">
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>By</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visibleApproved.map((b) => (
                  <tr key={b.id}>
                    <td className="mono">{b.billNo}</td>
                    <td>{b.customerName}</td>
                    <td className="mono">{formatINR(b.grandTotal)}</td>
                    <td>
                      <span className={`sf-status-pill ${b.paymentMode.toLowerCase().replace(/[^a-z]+/g, "-")}`}>
                        <span className="dot" />
                        {b.paymentMode}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{b.approvedBy}</td>
                    <td>
                      <button
                        className="sf-btn sf-btn-sm"
                        onClick={() => printBill(b)}
                        title="Reprint receipt"
                      >
                        Reprint
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ApprovalModal
        bill={modalBill}
        mode={modalMode}
        onClose={closeModal}
        onUpdate={handleUpdate}
        onConfirm={handleConfirm}
        confirming={confirming}
        conflictMessage={conflictMessage}
      />

      {ReceiptPortal}
    </Layout>
  );
}