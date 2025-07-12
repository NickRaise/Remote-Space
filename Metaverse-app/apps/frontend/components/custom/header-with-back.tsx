"use client";

import { useRouter } from "next/navigation";
import Logo from "./logo";

const HeaderWithBack = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 max-w-6xl mx-auto">
      <Logo />
      <button
        onClick={() => router.back()}
        className="text-sm md:text-base text-custom-primary hover:text-custom-accent cursor-pointer hover:underline underline-offset-4 transition"
      >
        ← Go Back
      </button>
    </div>
  );
};

export default HeaderWithBack;
