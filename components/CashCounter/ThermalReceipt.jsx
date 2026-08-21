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

// Same normalization logic as the PDF generator — rate is derived as
// total_amount / qty since the API's raw "rate" field is tax-exclusive.
// Serial number is just the item's position in the list (1-indexed).
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
  const discount = Number(bill.discountTotal ?? bill.discount ?? 0);

  const tokenNumber = bill.tokenNumber;
  const customerMobile = bill.customerMobile;
  const customerGstin = bill.gstNumber;
  const isWalkIn = !bill.customerName || /walk[\s-]?in/i.test(bill.customerName);

  return (
    <div className="sf-receipt">
      <style jsx global>{`
        @media screen {
          .sf-receipt {
            display: none;
          }
        }
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          html,
          body {
            width: 80mm;
          }
          body * {
            visibility: hidden !important;
          }
          .sf-receipt,
          .sf-receipt * {
            visibility: visible !important;
          }
          .sf-receipt {
            position: absolute;
            top: 0;
            left: 0;
            width: 76mm;
            padding: 2mm 2mm 6mm;
            font-family: "Courier New", monospace;
            color: #000;
            font-size: 10.5px;
            line-height: 1.35;
          }
          .sf-r-center {
            text-align: center;
          }
          .sf-r-bold {
            font-weight: 700;
          }
          .sf-r-hr {
            border-top: 1px dashed #000;
            margin: 4px 0;
          }
          .sf-r-row {
            display: flex;
            justify-content: space-between;
            gap: 6px;
          }
          .sf-r-title {
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          .sf-r-items table {
            width: 100%;
            border-collapse: collapse;
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
          }
          .sf-r-items .num {
            text-align: right;
            white-space: nowrap;
          }
          .sf-r-particulars {
            word-break: break-word;
          }
          .sf-r-totals .sf-r-row {
            font-size: 10.5px;
          }
          .sf-r-grand {
            font-size: 13px;
          }
          .sf-r-footer {
            margin-top: 6px;
          }
        }
      `}</style>

      {/* <div className="sf-r-center sf-r-bold sf-r-title">{COMPANY.name}</div> */}
      <div className="sf-r-row">
        <span className="sf-r-bold">TAX INVOICE</span>
        <span>Ph: {COMPANY.phones.join(", ")}</span>
      </div>

      <div className="sf-r-hr" />

      <div className="sf-r-center sf-r-bold sf-r-title">{COMPANY.name}</div>
      <div className="sf-r-center">{COMPANY.address}</div>
      <div className="sf-r-center">GSTIN: {COMPANY.gstin}</div>

      <div className="sf-r-hr" />

      <div className="sf-r-row">
        <span>Date: {formatDate(bill.submittedAt)}</span>
        {tokenNumber ? <span>Token: #{tokenNumber}</span> : null}
      </div>
      <div className="sf-r-row">
        <span>Name: {isWalkIn ? "Walk-in" : bill.customerName}</span>
      </div>
      <div className="sf-r-row">
        <span>Bill No: {bill.billNo || "-"}</span>
      </div>
      {customerMobile ? (
        <div className="sf-r-row">
          <span>Mobile: {customerMobile}</span>
        </div>
      ) : null}
      {customerGstin ? (
        <div className="sf-r-row">
          <span>GSTIN: {customerGstin}</span>
        </div>
      ) : null}

      <div className="sf-r-hr" />

      <div className="sf-r-items">
        <table>
          <thead>
            <tr>
              <th style={{ width: "8%" }}>Sr</th>
              <th style={{ width: "10%" }}>Qty</th>
              <th style={{ width: "17%" }}>HSN</th>
              <th style={{ width: "33%" }}>Item</th>
              <th className="num" style={{ width: "16%" }}>
                Rate
              </th>
              <th className="num" style={{ width: "16%" }}>
                Amt
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.sr}>
                <td>{it.sr}</td>
                <td>{it.qty}</td>
                <td>{it.hsn}</td>
                <td className="sf-r-particulars">{it.particulars}</td>
                <td className="num">{money(it.rateIncGst)}</td>
                <td className="num">{money(it.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sf-r-hr" />

      <div className="sf-r-totals">
        <div className="sf-r-row">
          <span>Taxable Amount</span>
          <span>{money(taxableAmount)}</span>
        </div>
        <div className="sf-r-row">
          <span>CGST 9%</span>
          <span>{money(cgst)}</span>
        </div>
        <div className="sf-r-row">
          <span>SGST 9%</span>
          <span>{money(sgst)}</span>
        </div>
        {discount > 0 && (
          <div className="sf-r-row">
            <span>Discount</span>
            <span>-{money(discount)}</span>
          </div>
        )}
        <div className="sf-r-hr" />
        <div className="sf-r-row sf-r-bold sf-r-grand">
          <span>TOTAL</span>
          <span>Rs. {money(totalAmount)}</span>
        </div>
        <div className="sf-r-row">
          <span>Payment Mode</span>
          <span>{String(bill.paymentMode || "-").toUpperCase()}</span>
        </div>
      </div>

      <div className="sf-r-hr" />
      <div className="sf-r-footer sf-r-center">
        <div>The above rates are inclusive of GST</div>
        <div className="sf-r-bold" style={{ marginTop: 4 }}>
          Thank You! Visit Again
        </div>
      </div>
    </div>
  );
}

// Drop this hook into any page. Call printBill(bill) to trigger a thermal
// print, and render {ReceiptPortal} once anywhere in that page's JSX
// (it's invisible on screen — only shows up in the print output).
export function useThermalPrint() {
  const [bill, setBill] = useState(null);

  useEffect(() => {
    if (!bill) return;
    // Small delay lets the receipt actually paint before the print
    // dialog grabs the page.
    const t = setTimeout(() => window.print(), 60);
    const clear = () => setBill(null);
    window.addEventListener("afterprint", clear);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", clear);
    };
  }, [bill]);

  return {
    printBill: setBill,
    ReceiptPortal: <ReceiptContent bill={bill} />,
  };
}