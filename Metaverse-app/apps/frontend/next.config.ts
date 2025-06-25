import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // <-- allows all external sources
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "res.cloudinary.com",
  //       pathname: "/dryhyy4ob/image/upload/**",
  //     },
  //   ],
  // },
};

export default nextConfig;
