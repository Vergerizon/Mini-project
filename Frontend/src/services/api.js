export const apiBase = process.env.VITE_API_URL || 'http://localhost:3000';

export async function get(path) {
  const res = await fetch(`${apiBase}${path}`);
  return res.json();
}
