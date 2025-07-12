"use client";

import LoadingScreen from "@/components/sections/LoadingScreen";
import { useAuthGuard } from "@/custom-hooks/useAuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loading = useAuthGuard({ adminOnly: true });
  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
