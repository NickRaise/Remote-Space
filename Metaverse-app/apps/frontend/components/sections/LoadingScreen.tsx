"use client";

import { Rotate3DIcon } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-custom-bg-dark-1 flex flex-col items-center justify-center text-white z-100">
      <Rotate3DIcon className="size-12 text-custom-primary animate-spin-slow mb-4" />
      <h1 className="text-3xl font-bold text-custom-primary">SyncSpace</h1>
      <p className="text-sm text-gray-400 mt-2">
        Loading your virtual world...
      </p>
    </div>
  );
};

export default LoadingScreen;
