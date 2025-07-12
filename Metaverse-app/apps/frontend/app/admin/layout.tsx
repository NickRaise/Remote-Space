"use client";

import { useAuthGuard } from "@/custom-hooks/useAuthGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthGuard({ adminOnly: true });

  return <>{children}</>;
}
