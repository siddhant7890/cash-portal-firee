// // lib/api.js
// //
// // Everything in this file talks directly to the real backend from the
// // browser — there is no Next.js API route in between anymore, no
// // server-side cookie, and no local dummy database. The auth token lives in
// // localStorage and is attached to every authenticated request as a Bearer
// // token.

// import { getItem, setItem, removeItem } from "./storage";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// // ---------- Auth ----------

// export async function loginCashier(mobile, loginCode) {
//    const DEFAULT_LATITUDE = 20.9938093;
//     const DEFAULT_LONGITUDE = 75.5654971;

//   const res = await fetch(`${API_BASE}/api/sales/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ mobile_number: mobile, login_code: loginCode  ,  latitude: DEFAULT_LATITUDE,
//       longitude:  DEFAULT_LONGITUDE, }),
//   });
//   const data = await res.json();

//   if (!res.ok || !data.success) {
//     throw new Error(data.message || "Invalid mobile number or login code");
//   }

//   const { token, role, user } = data.data;
//   const session = {
//     id: user.id,
//     name: user.name,
//     mobile: user.mobile_number,
//     role,
//     isActive: user.is_active,
//   };

//   setItem("token", token);
//   setItem("user", session);
//   return session;
// }

// export function getSession() {
//   return getItem("user", null);
// }

// export function getToken() {
//   return getItem("token", null);
// }

// export function logoutCashier() {
//   removeItem("token");
//   removeItem("user");
// }

// // Every authenticated call goes through this so the Bearer token is never
// // duplicated across the file, and a 401 (expired/invalid token) always
// // clears the stored session instead of failing silently or looping.
// async function authedFetch(path, options = {}) {
//   const token = getToken();
//   const res = await fetch(`${API_BASE}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(options.headers || {}),
//     },
//   });

//   if (res.status === 401) {
//     removeItem("token");
//     removeItem("user");
//     const err = new Error("Session expired — please log in again.");
//     err.code = "UNAUTHORIZED";
//     throw err;
//   }

//   return res;
// }

// // ---------- Bills ----------

// // Normalizes the API's snake_case bill shape into what the UI uses.
// function normalizeBill(b) {
//   return {
//     id: b.id,
//     billNo: b.bill_no,
//     financialYear: b.financial_year,
//     customerName: b.customer_name,
//     customerMobile: b.customer_mobile,
//     salesPerson: b.sales_staff_name,
//     salesStaffId: b.sales_staff_id,
//     status: b.status,
//     whatsappSent: b.whatsapp_sent,
//     itemCount: b.item_count,
//     taxableTotal: b.taxable_amount,
//     cgstTotal: b.cgst_amount,
//     sgstTotal: b.sgst_amount,
//     grandTotal: b.total_amount,
//     submittedAt: b.created_at,
//   };
// }

// export async function getPendingBills() {
//   const res = await authedFetch("/api/admin/bills/pending", { method: "GET" });
//   const data = await res.json();
//   if (!data.success) throw new Error(data.message || "Failed to load pending bills");
//   return data.data.map(normalizeBill);
// }

// // mode: "cash" | "upi"
// export async function approveBill(id, mode) {
//   const res = await authedFetch(`/api/admin/bills/${id}/approve`, {
//     method: "POST",
//     body: JSON.stringify({ payment_mode: mode }),
//   });
//   const data = await res.json();

//   if (!res.ok || data.success === false) {
//     // Treat any failure as a possible conflict (bill already approved by
//     // the other cashier, or any other server-side rejection) and surface
//     // whatever message the backend sent — see README for why this is the
//     // best available concurrency signal given the current API surface.
//     throw new Error(data.message || "Could not approve this bill.");
//   }

//   return data.data || { id, status: "approved" };
// }

// export async function rejectBill(id) {
//   const res = await authedFetch(`/api/admin/bills/${id}/reject`, {
//     method: "POST",
//   });
//   const data = await res.json();

//   if (!res.ok || data.success === false) {
//     throw new Error(data.message || "Could not reject this bill.");
//   }

//   return data.data || { id, status: "rejected" };
// }


// lib/api.js
//
// Everything in this file talks directly to the real backend from the
// browser — there is no Next.js API route in between anymore, no
// server-side cookie, and no local dummy database. The auth token lives in
// localStorage and is attached to every authenticated request as a Bearer
// token.

import { getItem, setItem, removeItem } from "./storage";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// ---------- Auth ----------

export async function loginCashier(mobile, loginCode) {
   const DEFAULT_LATITUDE = 20.9938093;
    const DEFAULT_LONGITUDE = 75.5654971;

  const res = await fetch(`${API_BASE}/api/sales/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile_number: mobile, login_code: loginCode  ,  latitude: DEFAULT_LATITUDE,
      longitude:  DEFAULT_LONGITUDE, }),
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Invalid mobile number or login code");
  }

  const { token, role, user } = data.data;
  const session = {
    id: user.id,
    name: user.name,
    mobile: user.mobile_number,
    role,
    isActive: user.is_active,
  };

  setItem("token", token);
  setItem("user", session);
  return session;
}

export function getSession() {
  return getItem("user", null);
}

export function getToken() {
  return getItem("token", null);
}

export function logoutCashier() {
  removeItem("token");
  removeItem("user");
}

// Every authenticated call goes through this so the Bearer token is never
// duplicated across the file, and a 401 (expired/invalid token) always
// clears the stored session instead of failing silently or looping.
async function authedFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    removeItem("token");
    removeItem("user");
    const err = new Error("Session expired — please log in again.");
    err.code = "UNAUTHORIZED";
    throw err;
  }

  return res;
}

// ---------- Bills ----------

// Normalizes one line item's snake_case shape into what the UI/PDF uses.
function normalizeBillItem(it) {
  return {
    id: it.id,
    productId: it.product_id,
    productName: it.product_name,
    hsnCode: it.hsn_code,
    qty: it.qty,
    rate: it.rate,
    taxableAmount: it.taxable_amount,
    gstPercent: it.gst_percent,
    cgstPercent: it.cgst_percent,
    cgstAmount: it.cgst_amount,
    sgstPercent: it.sgst_percent,
    sgstAmount: it.sgst_amount,
    totalAmount: it.total_amount,
  };
}

// Normalizes the API's snake_case bill shape into what the UI uses.
function normalizeBill(b) {
  return {
    id: b.id,
    billNo: b.bill_no,
    financialYear: b.financial_year,
    customerName: b.customer_name,
    customerMobile: b.customer_mobile,
    tokenNumber: b.token_number,
    gstNumber: b.gst_number,
    salesPerson: b.sales_staff_name,
    salesStaffId: b.sales_staff_id,
    status: b.status,
    whatsappSent: b.whatsapp_sent,
    itemCount: b.item_count,
    items: Array.isArray(b.items) ? b.items.map(normalizeBillItem) : [],
    taxableTotal: b.taxable_amount,
    cgstTotal: b.cgst_amount,
    sgstTotal: b.sgst_amount,
    grandTotal: b.total_amount,
    submittedAt: b.created_at,
  };
}

export async function getPendingBills() {
  const res = await authedFetch("/api/admin/bills/pending", { method: "GET" });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to load pending bills");
  return data.data.map(normalizeBill);
}

// mode: "cash" | "upi"
export async function approveBill(id, mode) {
  const res = await authedFetch(`/api/admin/bills/${id}/approve`, {
    method: "POST",
    body: JSON.stringify({ payment_mode: mode }),
  });
  const data = await res.json();

  if (!res.ok || data.success === false) {
    // Treat any failure as a possible conflict (bill already approved by
    // the other cashier, or any other server-side rejection) and surface
    // whatever message the backend sent — see README for why this is the
    // best available concurrency signal given the current API surface.
    throw new Error(data.message || "Could not approve this bill.");
  }

  return data.data || { id, status: "approved" };
}

export async function rejectBill(id) {
  const res = await authedFetch(`/api/admin/bills/${id}/reject`, {
    method: "POST",
  });
  const data = await res.json();

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Could not reject this bill.");
  }

  return data.data || { id, status: "rejected" };
}