// lib/calc.js
export function formatINR(amount) {
  const n = Math.round(Number(amount) || 0);
  return `₹${n.toLocaleString("en-IN")}`;
}
