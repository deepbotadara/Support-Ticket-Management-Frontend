"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuth } from "@/lib/auth";

export const useAuthGuard = () => {
  const router = useRouter();
  const auth = useMemo(() => getStoredAuth(), []);

  useEffect(() => {
    if (!auth) {
      router.replace("/");
    }
  }, [auth, router]);

  return {
    ready: Boolean(auth),
    token: auth?.token || null,
    user: auth?.user || null,
  };
};
