"use client";

import React from "react";
import { UserPlus, MapIcon, ShapesIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/custom-hooks/useAuthGuard";

const AdminDashboard = () => {
  const router = useRouter();
  useAuthGuard({ adminOnly: true });

  return (
    <div className="min-h-screen px-6 py-10 bg-custom-bg-dark-1 text-white">
      <div className="flex justify-end mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-custom-accent text-custom-accent hover:bg-custom-accent hover:text-white transition duration-200 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <LogOut className="size-4" />
          Return to the Mortal Realm
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-custom-primary mb-2">
          Welcome, Creator God.
        </h1>
        <p className="text-gray-400 text-lg italic">
          Thee shall conjure worlds anew.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminCard
          icon={<UserPlus className="size-10 text-custom-primary" />}
          title="Create Avatar"
          description="Upload and manage new avatars for users."
          actionLabel="Go to Avatar Creator"
          href="/admin/avatar"
        />

        <AdminCard
          icon={<ShapesIcon className="size-10 text-custom-primary" />}
          title="Create Element"
          description="Design static or interactive elements for maps."
          actionLabel="Create Element"
          href="/admin/element"
        />

        <AdminCard
          icon={<MapIcon className="size-10 text-custom-primary" />}
          title="Create Map"
          description="Build and manage custom interactive maps."
          actionLabel="Start Mapping"
          href="/admin/map"
        />
      </div>
    </div>
  );
};

const AdminCard = ({
  icon,
  title,
  description,
  actionLabel,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
}) => {
  return (
    <div className="bg-custom-bg-dark-2 rounded-xl border border-[#393e46] shadow-md p-6 flex flex-col justify-between hover:shadow-[0_0_12px_#00ADB5]/40 transition duration-300">
      <div className="flex items-center space-x-4 mb-4">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-sm text-gray-300 mb-6">{description}</p>
      <a
        href={href}
        className="text-sm text-white bg-custom-primary hover:bg-custom-accent px-4 py-2 rounded-full text-center transition"
      >
        {actionLabel}
      </a>
    </div>
  );
};

export default AdminDashboard;
