// In dev, Vite proxies /api → localhost:5000 (no base needed).
// In production, set VITE_API_URL to the deployed server URL, e.g.:
//   https://victory-journal-server.vercel.app
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const apiUrl = (path) => `${BASE}${path}`;
