"use client";

import { useEffect } from "react";
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
  const token = useUserStore((s) => s.userToken);
  const role = useUserStore((s) => s.getUserRole());

  useEffect(() => {
    // Not logged in
    if (requireAuth && !token) {
      router.replace(redirectTo);
    }

    // Protect logged in user to visit login page
    if (!requireAuth && token) {
      router.replace("/");
    }

    // Protect admin page
    if (adminOnly && role !== "admin") {
      router.replace("/");
    }
  }, [token, role, router]);
};
