"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredAuth } from "@/lib/auth";

export const useAuthGuard = () => {
  const router = useRouter();
  const [state, setState] = useState({ ready: false, token: null, user: null });

  useEffect(() => {
    const auth = getStoredAuth();

    if (!auth) {
      router.replace("/");
      return;
    }

    setState({ ready: true, token: auth.token, user: auth.user });
  }, [router]);

  return state;
};
