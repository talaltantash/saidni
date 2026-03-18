// Central API base URL — uses env variable in production, proxy in development
export const API_BASE = import.meta.env.VITE_API_URL || '';

export const apiFetch = (path, options = {}) => {
  return fetch(`${API_BASE}${path}`, options);
};
