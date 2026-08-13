// lib/storage.js
// Thin wrapper around localStorage — SSR-safe (Next.js renders this file's
// functions server-side too, where `window` doesn't exist).

const PREFIX = "sf_cash_";

export function getItem(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    return fallback;
  }
}

export function setItem(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeItem(key) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PREFIX + key);
}
