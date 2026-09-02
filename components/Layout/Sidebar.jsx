import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth() || {};
  const [open, setOpen] = useState(false);

  const initials = (user?.name || "Cashier")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile-only top bar with the hamburger trigger */}
      <div className="sf-mobile-topbar">
        <div className="sf-mobile-brand">
          <img src="/shama-fireworks-logo.jpeg" alt="Shama Fireworks logo" />
          <span>Shama Fireworks</span>
        </div>
        <button
          type="button"
          className="sf-hamburger-btn"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="sf-sidebar-backdrop"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sf-sidebar ${open ? "sf-sidebar-open" : ""}`}>
        <button
          type="button"
          className="sf-sidebar-close"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="sf-brand">
          <div className="sf-brand-mark">
            <img src="/shama-fireworks-logo.jpeg" alt="Shama Fireworks logo" />
          </div>
          <div>
            <div className="sf-brand-name">Shama Fireworks</div>
            <div className="sf-brand-sub">Cash Portal</div>
          </div>
        </div>

        <nav className="sf-nav">
          <div className="sf-nav-item" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="7" width="20" height="12" rx="2" />
              <circle cx="12" cy="13" r="2.5" />
              <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
            </svg>
            Cash Counter
          </div>
        </nav>

        <div className="sf-sidebar-foot">
          <div className="sf-who-row">
            <div className="sf-avatar">{initials}</div>
            <div>
              <div className="sf-who">{user?.name || "Cashier"}</div>
              <div className="sf-role">Cash Counter</div>
            </div>
          </div>
          <button className="sf-logout-btn" onClick={logout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
