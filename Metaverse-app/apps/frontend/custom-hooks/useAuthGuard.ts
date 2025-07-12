"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export const useAuthGuard = ({
  adminOnly = false,
}: {
  adminOnly?: boolean;
}) => {
  const router = useRouter();
  const { hydrated, userToken, getUserRole } = useUserStore();

  useEffect(() => {
    if (!hydrated) return;

    if (!userToken) {
      router.replace("/login");
    } else if (adminOnly && getUserRole() !== "admin") {
      router.replace("/");
    }
  }, [hydrated, userToken, adminOnly]);
};
