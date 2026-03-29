"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { clearAuthToken } from "@/lib/auth";

const AUTH_STORAGE_KEY = "stm_auth";

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded = window.atob(padded);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const subscribe = (listener) => {
  if (typeof window === "undefined") return () => {};

  const onStorage = (event) => {
    if (!event.key || event.key === AUTH_STORAGE_KEY) {
      listener();
    }
  };

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
};

const getClientSnapshot = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
};

const getServerSnapshot = () => null;

export const useAuthGuard = () => {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const user = useMemo(() => {
    if (!token || typeof window === "undefined") return null;

    const payload = decodeJwtPayload(token);
    if (!payload || !payload.id || !payload.role) {
      clearAuthToken();
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }, [token]);

  useEffect(() => {
    if (token === null) {
      router.replace("/");
    }
  }, [token, router]);


  return {
    ready: Boolean(token && user),
    token,
    user,
  };
};
