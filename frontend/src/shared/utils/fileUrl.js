const FILE_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export function resolveFileUrl(path) {
  if (!path) return '';
  return `${FILE_BASE}${path}`;
}