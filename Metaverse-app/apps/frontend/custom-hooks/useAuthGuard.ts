"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export const useAuthGuard = ({
  requireAuth = true,
  adminOnly = false,
  redirectTo = "/login",
}: {
  requireAuth?: boolean;
  adminOnly?: boolean;
  redirectTo?: string;
} = {}) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  const hasHydrated = useUserStore((state) => state.hydrated);
  const token = useUserStore((state) => state.userToken);
  const getUserRole = useUserStore((state) => state.getUserRole);

  useEffect(() => {
    if (!hasHydrated) return;
    console.log("rehydrated:", token, getUserRole());
    const role = getUserRole();

    // Not logged in
    if (requireAuth && !token) {
      router.replace(redirectTo);
      return;
    }

    // Protect logged in user from visiting login page
    if (!requireAuth && token) {
      router.replace("/");
      return;
    }

    // Admin-only page
    if (adminOnly && role !== "Admin") {
      router.replace("/");
      return;
    }

    setIsChecking(false);
  }, [hasHydrated, token, requireAuth, adminOnly, redirectTo, getUserRole]);

  return isChecking;
};
