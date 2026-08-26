// import { useEffect, useState } from "react";

// const COMPANY = {
//   name: "SHAMA FIREWORKS INDUSTRIES",
//   address: "Sham Tara Building, A K Road, Jalgaon 425002",
//   phones: ["2233193", "2234497"],
//   gstin: "27AAMFS0917L1ZT",
// };

// function money(amount) {
//   return Number(amount || 0).toLocaleString("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });
// }

// function formatDate(dateStr) {
//   const d = dateStr ? new Date(dateStr) : new Date();
//   if (isNaN(d.getTime())) return String(dateStr);
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mm = String(d.getMonth() + 1).padStart(2, "0");
//   const hh = String(d.getHours()).padStart(2, "0");
//   const min = String(d.getMinutes()).padStart(2, "0");
//   return `${dd}/${mm}/${d.getFullYear()} ${hh}:${min}`;
// }

// // Same normalization logic as the PDF generator — rate is derived as
// // total_amount / qty since the API's raw "rate" field is tax-exclusive.
// // Serial number is just the item's position in the list (1-indexed).
// function getBillItems(bill) {
//   const raw = bill.items || [];
//   return raw.map((item, idx) => {
//     const qty = Number(item.qty) || 1;
//     const amount = Number(item.totalAmount ?? 0);
//     return {
//       sr: idx + 1,
//       qty,
//       hsn: item.hsnCode ?? "-",
//       particulars: item.productName ?? "-",
//       rateIncGst: Math.round((amount / qty) * 100) / 100,
//       amount,
//     };
//   });
// }

// function ReceiptContent({ bill }) {
//   if (!bill) return null;

//   const items = getBillItems(bill);
 
//   const totalAmount = Number(bill.grandTotal) || 0;
//   const taxableAmount = Number(bill.taxableTotal) || 0;
//   const cgst = Number(bill.cgstTotal) || 0;
//   const sgst = Number(bill.sgstTotal) || 0;
//   const discount = Number(bill.discountTotal ?? bill.discount ?? 0);

//   const tokenNumber = bill.tokenNumber;
//   const customerMobile = bill.customerMobile;
//   const customerGstin = bill.gstNumber;
//   const isWalkIn = !bill.customerName || /walk[\s-]?in/i.test(bill.customerName);

//   return (
//     <div className="sf-receipt">
//       <style jsx global>{`
//         @media screen {
//           .sf-receipt {
//             display: none;
//           }
//         }
//         @media print {
//           @page {
//             size: 80mm auto;
//             margin: 0;
//           }
//           html,
//           body {
//             width: 80mm;
//           }
//           body * {
//             visibility: hidden !important;
//           }
//           .sf-receipt,
//           .sf-receipt * {
//             visibility: visible !important;
//           }
//           .sf-receipt {
//             position: absolute;
//             top: 0;
//             left: 0;
//             width: 76mm;
//             padding: 2mm 2mm 6mm;
//             font-family: "Courier New", monospace;
//             color: #000;
//             font-size: 10.5px;
//             line-height: 1.35;
//           }
//           .sf-r-center {
//             text-align: center;
//           }
//           .sf-r-bold {
//             font-weight: 700;
//           }
//           .sf-r-hr {
//             border-top: 1px dashed #000;
//             margin: 4px 0;
//           }
//           .sf-r-row {
//             display: flex;
//             justify-content: space-between;
//             gap: 6px;
//           }
//           .sf-r-title {
//             font-size: 12px;
//             letter-spacing: 0.5px;
//           }
//           .sf-r-items table {
//             width: 100%;
//             border-collapse: collapse;
//             font-size: 8.3px;
//           }
//           .sf-r-items th {
//             text-align: left;
//             border-bottom: 1px dashed #000;
//             padding-bottom: 2px;
//             font-weight: 700;
//           }
//           .sf-r-items td {
//             padding: 2px 0;
//             vertical-align: top;
//           }
//           .sf-r-items .num {
//             text-align: right;
//             white-space: nowrap;
//           }
//           .sf-r-particulars {
//             word-break: break-word;
//           }
//           .sf-r-totals .sf-r-row {
//             font-size: 10.5px;
//           }
//           .sf-r-grand {
//             font-size: 13px;
//           }
//           .sf-r-footer {
//             margin-top: 6px;
//           }
//         }
//       `}</style>

//       {/* <div className="sf-r-center sf-r-bold sf-r-title">{COMPANY.name}</div> */}
//       <div className="sf-r-row">
//         <span className="sf-r-bold">TAX INVOICE</span>
//         <span>Ph: {COMPANY.phones.join(", ")}</span>
//       </div>

//       <div className="sf-r-hr" />

//       <div className="sf-r-center sf-r-bold sf-r-title">{COMPANY.name}</div>
//       <div className="sf-r-center">{COMPANY.address}</div>
//       <div className="sf-r-center">GSTIN: {COMPANY.gstin}</div>

//       <div className="sf-r-hr" />

//       <div className="sf-r-row">
//         <span>Date: {formatDate(bill.submittedAt)}</span>
//         {tokenNumber ? <span>Token: #{tokenNumber}</span> : null}
//       </div>
//       <div className="sf-r-row">
//         <span>Name: {isWalkIn ? "Walk-in" : bill.customerName}</span>
//       </div>
//       <div className="sf-r-row">
//         <span>Bill No: {bill.billNo || "-"}</span>
//       </div>
//       {customerMobile ? (
//         <div className="sf-r-row">
//           <span>Mobile: {customerMobile}</span>
//         </div>
//       ) : null}
//       {customerGstin ? (
//         <div className="sf-r-row">
//           <span>GSTIN: {customerGstin}</span>
//         </div>
//       ) : null}

//       <div className="sf-r-hr" />

//       <div className="sf-r-items">
//         <table>
//           <thead>
//             <tr>
//               <th style={{ width: "8%" }}>Sr</th>
//               <th style={{ width: "10%" }}>Qty</th>
//               <th style={{ width: "17%" }}>HSN</th>
//               <th style={{ width: "33%" }}>Item</th>
//               <th className="num" style={{ width: "16%" }}>
//                 Rate
//               </th>
//               <th className="num" style={{ width: "16%" }}>
//                 Amt
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((it) => (
//               <tr key={it.sr}>
//                 <td>{it.sr}</td>
//                 <td>{it.qty}</td>
//                 <td>{it.hsn}</td>
//                 <td className="sf-r-particulars">{it.particulars}</td>
//                 <td className="num">{money(it.rateIncGst)}</td>
//                 <td className="num">{money(it.amount)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="sf-r-hr" />

//       <div className="sf-r-totals">
//         <div className="sf-r-row">
//           <span>Taxable Amount</span>
//           <span>{money(taxableAmount)}</span>
//         </div>
//         <div className="sf-r-row">
//           <span>CGST 9%</span>
//           <span>{money(cgst)}</span>
//         </div>
//         <div className="sf-r-row">
//           <span>SGST 9%</span>
//           <span>{money(sgst)}</span>
//         </div>
//         {discount > 0 && (
//           <div className="sf-r-row">
//             <span>Discount</span>
//             <span>-{money(discount)}</span>
//           </div>
//         )}
//         <div className="sf-r-hr" />
//         <div className="sf-r-row sf-r-bold sf-r-grand">
//           <span>TOTAL</span>
//           <span>Rs. {money(totalAmount)}</span>
//         </div>
//         <div className="sf-r-row">
//           <span>Payment Mode</span>
//           <span>{String(bill.paymentMode || "-").toUpperCase()}</span>
//         </div>
//       </div>

//       <div className="sf-r-hr" />
//       <div className="sf-r-footer sf-r-center">
//         <div>The above rates are inclusive of GST</div>
//         <div className="sf-r-bold" style={{ marginTop: 4 }}>
//           Thank You! Visit Again
//         </div>
//       </div>
//     </div>
//   );
// }

// // Drop this hook into any page. Call printBill(bill) to trigger a thermal
// // print, and render {ReceiptPortal} once anywhere in that page's JSX
// // (it's invisible on screen — only shows up in the print output).
// export function useThermalPrint() {
//   const [bill, setBill] = useState(null);

//   useEffect(() => {
//     if (!bill) return;
//     // Small delay lets the receipt actually paint before the print
//     // dialog grabs the page.
//     const t = setTimeout(() => window.print(), 60);
//     const clear = () => setBill(null);
//     window.addEventListener("afterprint", clear);
//     return () => {
//       clearTimeout(t);
//       window.removeEventListener("afterprint", clear);
//     };
//   }, [bill]);

//   return {
//     printBill: setBill,
//     ReceiptPortal: <ReceiptContent bill={bill} />,
//   };
// }



import { useEffect, useState } from "react";

const COMPANY = {
  name: "SHAMA FIREWORKS INDUSTRIES",
  address: "Sham Tara Building, A K Road, Jalgaon 425002",
  phones: ["2233193", "2234497"],
  gstin: "27AAMFS0917L1ZT",
};

function money(amount) {
  return Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDate(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();

  if (isNaN(d.getTime())) return String(dateStr);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");

  return `${dd}/${mm}/${d.getFullYear()} ${hh}:${min}`;
}

// Same normalization logic as the PDF generator.
// Rate is derived as total_amount / qty since the API's
// raw "rate" field is tax-exclusive.
// Serial number is the item's position in the list.
function getBillItems(bill) {
  const raw = bill.items || [];

  return raw.map((item, idx) => {
    const qty = Number(item.qty) || 1;
    const amount = Number(item.totalAmount ?? 0);

    return {
      sr: idx + 1,
      qty,
      hsn: item.hsnCode ?? "-",
      particulars: item.productName ?? "-",
      rateIncGst: Math.round((amount / qty) * 100) / 100,
      amount,
    };
  });
}

function ReceiptContent({ bill }) {
  if (!bill) return null;

  const items = getBillItems(bill);

  const totalAmount = Number(bill.grandTotal) || 0;
  const taxableAmount = Number(bill.taxableTotal) || 0;
  const cgst = Number(bill.cgstTotal) || 0;
  const sgst = Number(bill.sgstTotal) || 0;
  const discount = Number(
    bill.discountTotal ?? bill.discount ?? bill.discount_amount ?? 0
  );

  const tokenNumber = bill.tokenNumber;
  const customerMobile = bill.customerMobile;
  const customerGstin = bill.gstNumber;
  const numberOfCartoon = bill.numberOfCartoon ?? bill.number_of_cartoon;

  const totalCash = Number(bill.total_cash) || 0;
  const totalUpi = Number(bill.total_upi) || 0;
  const isSplitPayment = totalCash > 0 && totalUpi > 0;

  const isWalkIn =
    !bill.customerName ||
    /walk[\s-]?in/i.test(bill.customerName);

  return (
    <div className="sf-receipt">
      <style jsx global>{`
        /* ================================
           SCREEN
        ================================= */

        @media screen {
          .sf-receipt {
            display: none;
          }
        }

        /* ================================
           THERMAL PRINT
        ================================= */

        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }

          html,
          body {
            width: 80mm;
            margin: 0;
            padding: 0;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          body * {
            visibility: hidden !important;
          }

          .sf-receipt,
          .sf-receipt * {
            visibility: visible !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .sf-receipt {
            position: absolute;
            top: 0;

            /*
              TM-T82 is an 80mm printer. Centering a 76mm content block
              (instead of pinning it to left:0) splits the leftover 4mm
              evenly as a 2mm margin on each side, so a slightly
              misaligned print head doesn't clip the left edge and the
              content isn't left-shifted with dead space on the right.
            */
            left: 50%;
            transform: translateX(-50%);
            width: 76mm;

            /*
              Top    = 2mm
              Left   = 2mm
              Right  = 2mm
              Bottom = 50mm

              Bottom padding creates approximately
              5cm extra blank paper before cutting.
            */
            padding: 2mm 2mm 50mm;

            box-sizing: border-box;

            font-family: "Courier New", monospace;
            color: #000;
            font-weight: 700;

            /*
              Thermal heads render anti-aliased grey edges as no-dot,
              so smoothing makes print look faint. Disabling it plus a
              thickening text-shadow makes strokes solid black instead.
            */
            -webkit-font-smoothing: none;
            font-smooth: never;
            text-shadow:
              0.2px 0 0 currentColor,
              -0.2px 0 0 currentColor,
              0 0.2px 0 currentColor,
              0 -0.2px 0 currentColor;

            font-size: 10.5px;
            line-height: 1.35;

            background: #fff;
          }

          /* ================================
             GENERAL
          ================================= */

          .sf-r-center {
            text-align: center;
          }

          .sf-r-bold {
            font-weight: 700;
          }

          .sf-r-hr {
            border-top: 1px dashed #000;
            margin: 4px 0;
            width: 100%;
          }

          .sf-r-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 6px;
            width: 100%;
          }

          /* ================================
             HEADER
          ================================= */

          .sf-r-title {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }

          .sf-r-company {
            font-size: 12px;
            font-weight: 700;
            line-height: 1.25;
          }

          .sf-r-phone {
            font-size: 10.5px;
            font-weight: 700;
            margin-top: 1px;
          }

          .sf-r-address {
            font-size: 10px;
            line-height: 1.25;
            margin-top: 1px;
          }

          .sf-r-gstin {
            font-size: 10px;
            margin-top: 1px;
          }

          /* ================================
             ITEMS TABLE
          ================================= */

          .sf-r-items {
            width: 100%;
          }

          .sf-r-items table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 8.3px;
          }

          .sf-r-items th {
            text-align: left;
            border-bottom: 1px dashed #000;
            padding-bottom: 2px;
            font-weight: 700;
          }

          .sf-r-items td {
            padding: 2px 0;
            vertical-align: top;
            word-wrap: break-word;
          }

          .sf-r-items .num {
            text-align: right;
            white-space: nowrap;
          }

          .sf-r-particulars {
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          /* ================================
             TOTALS
          ================================= */

          .sf-r-totals {
            width: 100%;
          }

          .sf-r-totals .sf-r-row {
            font-size: 10.5px;
            line-height: 1.4;
          }

          .sf-r-grand {
            font-size: 13px !important;
            line-height: 1.5;
          }

          /* ================================
             FOOTER
          ================================= */

          .sf-r-footer {
            margin-top: 6px;
            font-size: 10px;
          }

          .sf-r-footer .sf-r-bold {
            margin-top: 4px;
          }
        }
      `}</style>

      {/* =====================================
          TAX INVOICE
      ====================================== */}

            <div className="sf-r-center sf-r-bold sf-r-title">
        CASH MEMO
      </div>
            <div className="sf-r-center sf-r-bold sf-r-title">
       SUBJECT TO JALGAON JURISDICTION
      </div>

      <div className="sf-r-center sf-r-bold sf-r-title">
        TAX INVOICE
      </div>

      {/* =====================================
          COMPANY NAME
      ====================================== */}

      <div className="sf-r-center sf-r-bold sf-r-company">
        {COMPANY.name}
      </div>

      {/* =====================================
          PHONE NUMBER
      ====================================== */}

      <div className="sf-r-center sf-r-phone">
        Ph: {COMPANY.phones.join(", ")}
      </div>

      {/* =====================================
          ADDRESS
      ====================================== */}

      <div className="sf-r-center sf-r-address">
        {COMPANY.address}
      </div>

      {/* =====================================
          COMPANY GSTIN
      ====================================== */}

      <div className="sf-r-center sf-r-gstin">
        GSTIN: {COMPANY.gstin}
      </div>

      <div className="sf-r-hr" />

      {/* =====================================
          BILL INFORMATION
      ====================================== */}

      <div className="sf-r-row">
        <span className=" sf-r-bold ">
          Date: {formatDate(bill.submittedAt)}
        </span>

        {tokenNumber ? (
          <span>
            Token: #{tokenNumber}
          </span>
        ) : null}
      </div>

      <div className="sf-r-row">
        <span>
          Name: {isWalkIn ? "Walk-in" : bill.customerName}
        </span>
      </div>

      <div className="sf-r-row">
        <span>
          Bill No: {bill.billNo || "-"}
        </span>

        {numberOfCartoon != null ? (
          <span>
            Cartons: {numberOfCartoon}
          </span>
        ) : null}
      </div>

      {/* CUSTOMER MOBILE */}

      {customerMobile ? (
        <div className="sf-r-row">
          <span>
            Mobile: {customerMobile}
          </span>
        </div>
      ) : null}

      {/* CUSTOMER GSTIN */}

      {customerGstin ? (
        <div className="sf-r-row">
          <span>
            GSTIN: {customerGstin}
          </span>
        </div>
      ) : null}

      <div className="sf-r-hr" />

      {/* =====================================
          ITEMS
      ====================================== */}

      <div className="sf-r-items">
        <table>
          <thead>
            <tr>
              <th style={{ width: "8%" }}>
                Sr
              </th>

              <th style={{ width: "10%" }}>
                Qty
              </th>

              <th style={{ width: "17%" }}>
                HSN
              </th>

              <th style={{ width: "33%" }}>
                Item
              </th>

              <th
                className="num"
                style={{ width: "16%" }}
              >
                Rate
              </th>

              <th
                className="num"
                style={{ width: "16%" }}
              >
                Amt
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((it) => (
              <tr key={it.sr}>
                <td>
                  {it.sr}
                </td>

                <td>
                  {it.qty}
                </td>

                <td>
                  {it.hsn}
                </td>

                <td className="sf-r-particulars">
                  {it.particulars}
                </td>

                <td className="num">
                  {money(it.rateIncGst)}
                </td>

                <td className="num">
                  {money(it.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sf-r-hr" />

      {/* =====================================
          TOTALS
      ====================================== */}

      <div className="sf-r-totals">

        {/* TAXABLE */}

        <div className="sf-r-row">
          <span>
            Taxable Amount
          </span>

          <span>
            {money(taxableAmount + discount)}
          </span>
        </div>

        {/* DISCOUNT */}

        {discount > 0 && (
          <div className="sf-r-row">
            <span>
              Discount
            </span>

            <span>
              -{money(discount)}
            </span>
          </div>
        )}

        {/* CGST */}

        <div className="sf-r-row">
          <span>
            CGST 9%
          </span>

          <span>
            {money(cgst)}
          </span>
        </div>

        {/* SGST */}

        <div className="sf-r-row">
          <span>
            SGST 9%
          </span>

          <span>
            {money(sgst)}
          </span>
        </div>
{/* ROUND OFF */}
  {Number(bill.round_off_amount) !== 0 && (
    <div className="sf-r-row">
      <span>Round Off</span>
      <span>
        {Number(bill.round_off_amount) > 0 ? "+" : ""}
        {money(bill.round_off_amount)}
      </span>
    </div>
  )}
        <div className="sf-r-hr" />

        {/* GRAND TOTAL */}

        <div className="sf-r-row sf-r-bold sf-r-grand">
          <span>
            TOTAL
          </span>

          <span>
            Rs. {money(totalAmount)}
          </span>
        </div>

        {/* PAYMENT MODE */}

        <div className="sf-r-row">
          <span>
            Payment Mode
          </span>

          <span>
            {String(
              bill.paymentMode || "-"
            ).toUpperCase()}
          </span>
        </div>

        {isSplitPayment && (
          <>
            <div className="sf-r-row">
              <span>&nbsp;&nbsp;Cash</span>
              <span>{money(totalCash)}</span>
            </div>
            <div className="sf-r-row">
              <span>&nbsp;&nbsp;UPI</span>
              <span>{money(totalUpi)}</span>
            </div>
          </>
        )}
      </div>

      <div className="sf-r-hr" />

      {/* =====================================
          FOOTER
      ====================================== */}

      <div className="sf-r-footer sf-r-center">

        <div>
          The above rates are inclusive of GST
        </div>

        <div
          className="sf-r-bold"
          style={{ marginTop: 5 }}
        >
          Thank You! Visit Again
        </div>
           <div
          className="sf-r-bold"
          style={{ marginTop: 80 }}
        >
          -
        </div>

      </div>

      {/* 
        The remaining ~50mm blank space is created
        automatically by the bottom padding of
        .sf-receipt.
      */}
    </div>
  );
}

// =====================================================
// THERMAL PRINT HOOK
// =====================================================
//
// Usage:
//
// const { printBill, ReceiptPortal } = useThermalPrint();
//
// <button onClick={() => printBill(bill)}>
//   Print Bill
// </button>
//
// {ReceiptPortal}
//
// =====================================================

export function useThermalPrint() {
  const [bill, setBill] = useState(null);

  useEffect(() => {
    if (!bill) return;

    // Small delay allows the receipt to render
    // before Chrome starts the print process.
    const t = setTimeout(() => {
      window.print();
    }, 60);

    const clear = () => {
      setBill(null);
    };

    window.addEventListener(
      "afterprint",
      clear
    );

    return () => {
      clearTimeout(t);

      window.removeEventListener(
        "afterprint",
        clear
      );
    };
  }, [bill]);

  return {
    printBill: setBill,
    ReceiptPortal: (
      <ReceiptContent bill={bill} />
    ),
  };
}