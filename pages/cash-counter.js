import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Layout from "@/components/Layout/Layout";
import ApprovalModal from "@/components/CashCounter/ApprovalModal";
import { useRequireAuth } from "@/context/AuthContext";
import { getPendingBills, approveBill , rejectBill } from "@/lib/api";
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

// Stable pseudo-random split — a bill always lands in the same block on
// every render/poll (hashed from its id), rather than jumping between
// blocks each refresh, which would be confusing to work against.
function splitGroup(id) {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash % 2 === 0 ? "A" : "B";
}

function matchesSearch(bill, query) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    bill.billNo.toLowerCase().includes(q) ||
    bill.customerName.toLowerCase().includes(q)
  );
}

function PendingBlock({ label, bills, search, onSearchChange, onApprove }) {
  const filtered = bills.filter((b) => matchesSearch(b, search));

  return (
    <div className="sf-panel">
      <div className="sf-panel-title">
        {label} ({bills.length})
      </div>

      <div className="sf-search-bar mb-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          placeholder="Search bill no. or customer name"
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

      {filtered.map((b) => (
        <div key={b.id} className="sf-queue-row">
          <div className="sf-qinfo">
            <div className="sf-qbill">{b.billNo}</div>
            <div className="sf-qcust">{b.customerName}</div>
            <div className="sf-qsub">
              {b.salesPerson} · {b.itemCount} item{b.itemCount === 1 ? "" : "s"}{" "}
              · submitted {timeAgo(b.submittedAt)}
            </div>
          </div>
          <div className="sf-qamt">{formatINR(b.grandTotal)}</div>
          <div className="d-flex gap-2">
            <button
              className="sf-btn sf-btn-cash sf-btn-sm"
              onClick={() => onApprove(b, "cash")}
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
            </button>
            <button
              className="sf-btn sf-btn-upi sf-btn-sm"
              onClick={() => onApprove(b, "upi")}
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
            </button>
            <button
              className="sf-btn sf-btn-reject sf-btn-sm"
              onClick={() => onApprove(b, "reject")}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CashCounterPage() {
  const { user, ready } = useRequireAuth();
  const [pending, setPending] = useState([]);
  const [approvedThisSession, setApprovedThisSession] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalBill, setModalBill] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [conflictMessage, setConflictMessage] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(Date.now());
  const [searchA, setSearchA] = useState("");
  const [searchB, setSearchB] = useState("");
  const pollRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const bills = await getPendingBills();
      setPending(bills);
      setLastRefreshed(Date.now());
      setLoadError(null);
    } catch (err) {
      if (err.code === "UNAUTHORIZED") return; // useRequireAuth will redirect
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
    pending.forEach((bill) =>
      splitGroup(bill.id) === "A" ? a.push(bill) : b.push(bill),
    );
    return { blockA: a, blockB: b };
  }, [pending]);

  if (!ready || !user) return null;

  async function openModal(bill, mode) {
    setModalBill(bill);
    setModalMode(mode);
    setConflictMessage(null);

    // Best-effort freshness check: re-fetch the pending list right as the
    // modal opens. If this bill has vanished from it, someone else already
    // approved it since our last poll — surface that immediately instead
    // of waiting for the approve call to fail. See README for why this
    // (rather than a real lock) is the concurrency approach here.
    try {
      const fresh = await getPendingBills();
      setPending(fresh);
      if (!fresh.some((b) => b.id === bill.id)) {
        setConflictMessage(
          "This bill is no longer pending — it may have just been approved by someone else.",
        );
      }
    } catch (err) {
      // If the freshness check itself fails, don't block the operator —
      // the approve call below still has its own error handling.
    }
  }

  function closeModal() {
    setModalBill(null);
    setModalMode(null);
    setConflictMessage(null);
  }

async function handleConfirm(bill, mode) {
  setConfirming(true);
  try {
    if (mode === "reject") {
      await rejectBill(bill.id);
    } else {
      await approveBill(bill.id, mode);
    }

    setPending((prev) => prev.filter((b) => b.id !== bill.id));

    if (mode !== "reject") {
      setApprovedThisSession((prev) => [
        { ...bill, paymentMode: mode === "cash" ? "Cash" : "UPI", approvedBy: user.name, approvedAt: new Date().toISOString() },
        ...prev,
      ]);
      window.print(); // placeholder for the real thermal-printer trigger
    }

    closeModal();
  } catch (err) {
    setConflictMessage(err.message || "Could not process this bill. Try again.");
    refresh();
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
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
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
        Updated {secondsAgo <= 1 ? "just now" : `${secondsAgo}s ago`} ·
        auto-refreshes every {POLL_MS / 1000}s · pending bills are split into
        two counters below so both cashiers can work independently
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
      {/* {loadError && (
        <div style={{ fontSize: 13, color: "var(--danger)", marginTop: 12 }}>
          No Bills Found
        </div>
      )} */}

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
        {approvedThisSession.length === 0 && (
          <div style={{ fontSize: 13, color: "var(--ink-soft)" }}>
            Nothing approved yet this session.
          </div>
        )}
        {approvedThisSession.length > 0 && (
          <div className="sf-table-wrap">
            <table className="sf-table">
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {approvedThisSession.map((b) => (
                  <tr key={b.id}>
                    <td className="mono">{b.billNo}</td>
                    <td>{b.customerName}</td>
                    <td className="mono">{formatINR(b.grandTotal)}</td>
                    <td>
                      <span
                        className={`sf-status-pill ${b.paymentMode.toLowerCase()}`}
                      >
                        <span className="dot" />
                        {b.paymentMode}
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{b.approvedBy}</td>
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
        onConfirm={handleConfirm}
        confirming={confirming}
        conflictMessage={conflictMessage}
      />
    </Layout>
  );
}
