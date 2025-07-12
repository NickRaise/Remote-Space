"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/custom/NavBar";
import Image from "next/image";

const HomePage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-custom-bg-dark-1 text-white">
      <Navbar />

      <section className="text-center py-24 px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-custom-primary to-custom-accent text-transparent bg-clip-text">
          Bring Your Remote Office to Life
        </h1>
        <p className="mt-4 text-lg md:text-xl text-custom-text-secondary italic">
          Thee shall walk among pixels and peers.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => router.push("/join")}
            className="px-6 py-3 text-lg rounded-full font-semibold bg-custom-primary hover:bg-custom-accent transition-all duration-300"
          >
            🕹️ Join a Space
          </button>

          <button
            onClick={() => router.push("/my-space")}
            className="px-6 py-3 text-lg rounded-full font-semibold bg-transparent border border-custom-primary hover:bg-custom-primary transition-all duration-300"
          >
            🏗️ Create Your Own
          </button>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-custom-primary">
          Step Inside the Pixelverse
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Host meetings, explore arenas, and collaborate like never before — all
          inside a retro-themed, real-time virtual world built for teams.
        </p>

        <div className="mt-10">
          <div className="w-full aspect-video rounded-xl border border-[#393e46] overflow-hidden relative">
            <Image
              src="/demo-pic.png"
              alt="Metaverse Preview"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
