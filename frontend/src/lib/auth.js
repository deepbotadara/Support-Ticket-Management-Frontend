const AUTH_STORAGE_KEY = "stm_auth";

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);

    if (typeof window === "undefined") return null;
    const decoded = window.atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

export const getStoredAuth = () => {
  if (typeof window === "undefined") return null;

  const token = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.id || !payload.role) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }

  return {
    token,
    user: {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    },
  };
};

export const saveAuthToken = (token) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, token);
};

export const clearAuthToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
