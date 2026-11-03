import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "@/components/Layout/Layout";
import CashLogDetailModal from "@/components/CashLogs/CashLogDetailModal";
import { useThermalPrint } from "@/components/CashCounter/ThermalReceipt";
import { useRequireAuth } from "@/context/AuthContext";
import { getCashLogs, updateBill } from "@/lib/api";
import { formatINR } from "@/lib/calc";

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()} ${hh}:${min}`;
}

const PAGE_SIZE = 10;

function matchesSearch(bill, query) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  const token = String(bill.tokenNumber ?? "");
  return (
    token.toLowerCase().includes(q) ||
    String(bill.billNo || "").toLowerCase().includes(q) ||
    String(bill.customerName || "").toLowerCase().includes(q) ||
    String(bill.salesPerson || "").toLowerCase().includes(q)
  );
}

// The thermal receipt hook needs round_off_amount/RoundOff keys that this
// page's normalized bills carry as `roundOff` — bridge that here rather
// than changing the shared normalizer's naming for every other screen.
function toReceiptBill(bill) {
  return {
    ...bill,
    round_off_amount: bill.roundOff,
    RoundOff: bill.roundOff,
  };
}

export default function CashLogsPage() {
  const { user, ready } = useRequireAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());

  const [selectedBill, setSelectedBill] = useState(null);
  const [modalStartInEdit, setModalStartInEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState(null);

  const { printBill, ReceiptPortal } = useThermalPrint();

  const refresh = useCallback(async () => {
    try {
      // admin_id is a fixed part of this endpoint, not the logged-in
      // user's own id — leave it hardcoded to 1, as given.
      const data = await getCashLogs(1);
      setLogs(data);
      setLastRefreshed(Date.now());
      setLoadError(null);
    } catch (err) {
      if (err.code === "UNAUTHORIZED") return;
      setLoadError(err.message || "Could not load cash logs.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    refresh();
  }, [user, refresh]);

  const filtered = useMemo(
    () => logs.filter((b) => matchesSearch(b, search)),
    [logs, search],
  );

  // Jump back to page 1 whenever the search narrows (or widens) the list,
  // so you're never stuck looking at an empty page past the new end.
  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (!ready || !user) return null;

  function openView(bill) {
    setModalStartInEdit(false);
    setModalError(null);
    setSelectedBill(bill);
  }

  function openEdit(bill) {
    setModalStartInEdit(true);
    setModalError(null);
    setSelectedBill(bill);
  }

  function closeModal() {
    setSelectedBill(null);
    setModalError(null);
  }

  async function handleSave(bill, payload) {
    setSaving(true);
    setModalError(null);
    try {
      await updateBill(bill.id, payload);

      const patch = {
        customerName: payload.customerName,
        gstNumber: payload.gstNumber,
        customerMobile: payload.customerMobile,
        discountTotal: payload.discount_amount,
      };
      setLogs((prev) => prev.map((b) => (b.id === bill.id ? { ...b, ...patch } : b)));
      setSelectedBill((prev) => (prev && prev.id === bill.id ? { ...prev, ...patch } : prev));
    } catch (err) {
      setModalError(err.message || "Could not save changes.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  const secondsAgo = Math.round((Date.now() - lastRefreshed) / 1000);

  return (
    <Layout
      title="Cash logs"
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
        style={{
          fontSize: 11.5,
          color: "var(--ink-faint)",
          marginTop: -14,
          marginBottom: 16,
        }}
      >
        Updated {secondsAgo <= 1 ? "just now" : `${secondsAgo}s ago`} · view, edit, and reprint
        any bill
      </div>

      <div className="sf-panel">
        <div className="sf-panel-title">Bills ({logs.length})</div>

        <div className="sf-search-bar mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            placeholder="Search by token, bill no., customer, or sales person"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && (
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>Loading...</div>
        )}

        {!loading && loadError && (
          <div style={{ fontSize: 13, color: "var(--danger)" }}>{loadError}</div>
        )}

        {!loading && !loadError && logs.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            No bills found.
          </div>
        )}

        {!loading && !loadError && logs.length > 0 && filtered.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            No bills match &quot;{search}&quot;.
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="sf-table-wrap">
            <table className="sf-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Bill No</th>
                  <th>Customer</th>
                  <th>Sales Person</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontSize: 12 }}>{formatDate(b.submittedAt)}</td>
                    <td className="mono">{b.billNo}</td>
                    <td>{b.customerName || "-"}</td>
                    <td>{b.salesPerson || "-"}</td>
                    <td className="mono">{b.itemCount ?? b.items?.length ?? 0}</td>
                    <td className="mono">{formatINR(b.grandTotal)}</td>
                    <td>
                      <span
                        className={`sf-status-pill ${String(b.status || "").toLowerCase()}`}
                      >
                        <span className="dot" />
                        {b.status || "-"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="sf-btn sf-btn-sm"
                          onClick={() => openView(b)}
                          title="View bill"
                        >
                          View
                        </button>
                        <button
                          className="sf-btn sf-btn-sm"
                          onClick={() => openEdit(b)}
                          title="Edit bill"
                        >
                          Edit
                        </button>
                        <button
                          className="sf-btn sf-btn-primary sf-btn-sm"
                          onClick={() => printBill(toReceiptBill(b))}
                          title="Print receipt"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9V4h12v5M6 18h12v-5H6v5z" />
                            <rect x="6" y="14" width="12" height="8" />
                          </svg>
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length > PAGE_SIZE && (
          <div
            className="d-flex align-items-center justify-content-between mt-3"
            style={{ fontSize: 12.5, color: "var(--ink-soft)" }}
          >
            <span>
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="d-flex gap-2">
              <button
                className="sf-btn sf-btn-sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
              >
                Previous
              </button>
              <span style={{ alignSelf: "center" }}>
                Page {safePage} of {totalPages}
              </span>
              <button
                className="sf-btn sf-btn-sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <CashLogDetailModal
        bill={selectedBill}
        startInEdit={modalStartInEdit}
        onClose={closeModal}
        onSave={handleSave}
        onPrint={(bill) => printBill(toReceiptBill(bill))}
        saving={saving}
        errorMessage={modalError}
      />

      {ReceiptPortal}
    </Layout>
  );
}
