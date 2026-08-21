# Shama Fireworks — Cash Portal

The Cash Counter screen as its own app — login, view pending bills, approve
with Cash/UPI, logout. **Fully client-side**: no server-side session, no
cookie, no local database. The browser talks directly to your real backend,
and the auth token lives in `localStorage`.

---

## 1. Setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

`.env.local.example` already points `NEXT_PUBLIC_API_BASE_URL` at your live
server, so this works out of the box:

```
NEXT_PUBLIC_API_BASE_URL=https://server-dot-project-59dfa9fb-4c35-49cd-856.el.r.appspot.com
```

Visit **http://localhost:3000** → redirects to `/login`. Log in with a real
mobile number + login code from your backend (e.g. `9423115252` / `2626`
per what you sent me).

---

## 2. The 3 endpoints wired up

| Endpoint | Method | Used for |
|---|---|---|
| `/api/sales/auth/login` | POST | Login — `{ mobile_number, login_code }` → token + user |
| `/api/admin/bills/pending` | GET | The pending queue on the main screen |
| `/api/admin/bills/{id}/approve` | POST | Approve — `{ payment_mode: "cash" \| "upi" }` |

All three are called directly from the browser (`lib/api.js`) — there's no
Next.js API route proxying them anymore. The token from login is stored in
`localStorage` (`sf_cash_token` key) and sent as `Authorization: Bearer
<token>` on the two authenticated calls.

**Logout** (`lib/api.js` → `logoutCashier()`) just clears `localStorage` —
no server call, since there's no server-side session to invalidate on this
end. If your backend has a logout/token-revocation endpoint, tell me and
I'll wire it in.

---

## 3. Two counters, split automatically + per-counter search

The pending queue is split into two side-by-side blocks — **Counter 1** and
**Counter 2** — so two cashiers can each work their own list without
scanning past bills the other one is already handling.

- Each bill lands in the same counter every time (a stable hash of its
  `id` decides which block it goes in), so bills don't jump between
  counters on every 10-second poll — that would be disorienting to work
  against.
- It's an even, effectively-random split — not based on sales person,
  amount, or anything meaningful — purely a load-balancing device between
  the two cash-counter screens.
- Each counter has its **own independent search box**, filtering by bill
  number or customer name, so one cashier searching doesn't affect what
  the other sees.
- Approving a bill in either counter removes it from whichever counter it
  was in and adds it to the "Approved this session" table below — same
  behavior either side.

## 4. No payment gateway — this was already the case, confirmed

Selecting **UPI** does exactly one thing: sends
`{ "payment_mode": "upi" }` to `/api/admin/bills/{id}/approve` — the same
call Cash makes, just with a different value. There's no Razorpay, no
payment link, no QR generation in this app; the physical QR code at the
counter is out-of-band from this software entirely, which is correct since
that's how it's actually used. I double-checked the codebase for any
payment-gateway code before this build and found none — this was already
the behavior, not a change.

---

## 5. What changed from the previous version (important)

The previous build of this app had its own Next.js API routes, an
httpOnly JWT cookie, and a local `data/bills.json` acting as a fake
database, with two hardcoded cashier accounts. **All of that is gone now:**

- ❌ `lib/auth.js`, `lib/withAuth.js`, `lib/db.js` — deleted
- ❌ `pages/api/*` — deleted entirely (login, logout, bills, approve,
  review, release)
- ❌ `data/bills.json` — deleted
- ❌ `CASHIER_1_*` / `CASHIER_2_*` env-based accounts — deleted; login now
  checks real credentials against your backend, so *any* valid sales-staff
  account can log in here (see the concurrency-and-scope note below)
- ✅ `lib/api.js` — new, calls your 3 real endpoints
- ✅ `lib/storage.js` — new, localStorage helpers
- ✅ `context/AuthContext.js` — rewritten for client-side session state
  instead of a server-provided cookie
- ✅ `pages/login.js` — rewritten: mobile number + login code instead of
  email/password
- ✅ `pages/cash-counter.js` — rewritten to call `lib/api.js` directly, with
  polling and a best-effort conflict check (see §4)

### A note on scope

Your login endpoint is `/api/sales/auth/login` and returns `role:
"sales_staff"` — the same login used by the sales staff app, not a
cash-counter-specific account system. That means, as integrated, **anyone
with valid sales-staff credentials can log into this Cash Portal** — there's
no role check restricting it to specific cash-counter operators. If that's
not what you want, let me know whether there's a separate cashier role/
endpoint, or whether the `role` field in the login response should be
checked here (e.g. reject login if `role !== "cashier"` or similar) —
happy to add that gate, it's a small change in `lib/api.js`'s
`loginCashier()`.

---

## 6. Concurrency: what's actually guaranteed now vs. before

This is worth reading carefully since "two cashiers, no overriding each
other" was the whole point of this app.

**Before** (previous version): approval went through *our own* Next.js API
route, which re-read the bill from a local file and rejected a second
approval attempt with a hard 409. That was a real, tested guarantee — I
could prove it with a race-condition test.

**Now**: approval goes straight to your `/api/admin/bills/{id}/approve`
endpoint. **Whether a double-approval is actually prevented depends
entirely on whether your backend checks the bill's current status before
applying the approval.** I don't have visibility into that endpoint's
implementation, so I can't guarantee it the way I could before.

What this app does on the client side to reduce (not eliminate) the risk:

1. **Polls the pending list** every `NEXT_PUBLIC_POLL_INTERVAL_SECONDS`
   (default 10s), so both cashiers' screens stay reasonably in sync.
2. **Re-checks freshness right when the modal opens** — it re-fetches the
   pending list and, if the bill has already disappeared (i.e. someone else
   approved it in the last few seconds), shows a warning immediately rather
   than waiting for the approve call to fail.
3. **Surfaces whatever error your backend returns** from the approve call
   as a conflict banner in the modal, and refreshes the list.

None of this is a substitute for the backend enforcing it. **Please
confirm with whoever owns `/api/admin/bills/{id}/approve` that it checks
`status == "pending"` before approving and rejects otherwise** (ideally
with a clear error message, since this app will just display whatever
message comes back). If it doesn't currently do that, that's the one
change that would make the "no overriding each other" guarantee real again
— everything client-side here is best-effort scaffolding around it, not a
replacement for it.

---

## 7. Other gaps worth knowing about

- **No "approved bills" endpoint.** Only `/api/admin/bills/pending` was
  given, so there's no way to show bills approved earlier (by anyone, ever)
  — the "Approved this session" panel is purely client-side state that
  resets on page refresh. If there's a
  `GET /api/admin/bills` or `/api/admin/bills/approved` (or similar), send
  it over and I'll make that panel show real history instead.
- **CORS.** All three calls now go directly from the browser to
  `appspot.com`. If you see a network error in the console (not a 401 or a
  validation error — just a flat failure) rather than a message from this
  app, that's almost certainly CORS blocking the request because the
  backend doesn't allow this app's origin.
- **Token expiry.** The JWT has an `exp` claim. Any call that gets a 401
  back clears localStorage and (via `useRequireAuth`) sends the user back
  to `/login`. There's no silent refresh.
- **Printing** is still a placeholder (`window.print()` in
  `pages/cash-counter.js`) — swap it for your real thermal-printer
  integration when ready.

---

## 8. Project structure

```
shama-fireworks-cash-portal/
├── lib/
│   ├── api.js            # All 3 endpoints — login, get pending, approve
│   ├── storage.js          # localStorage helpers
│   └── calc.js               # Currency formatting
├── context/
│   └── AuthContext.js     # Client-side session state, useRequireAuth()
├── components/
│   ├── Layout/              # Sidebar, Layout
│   └── CashCounter/           # ApprovalModal
├── pages/
│   ├── login.js            # Mobile number + login code
│   └── cash-counter.js       # Two-counter split (splitGroup helper, top of file),
│                               PendingBlock component, approve modal, session-only approved list
└── public/
    └── shama-fireworks-logo.jpeg
```

No `pages/api/`, no `data/`, no `lib/auth.js`/`db.js`/`withAuth.js` — this
app has no backend of its own anymore.
# cash-portal-firee
