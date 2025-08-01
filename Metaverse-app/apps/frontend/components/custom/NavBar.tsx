"use client";

import Link from "next/link";
import { Rotate3DIcon, MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useUserStore } from "@/store/userStore";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userToken = useUserStore((state) => state.userToken);
  const getUserRole = useUserStore((state) => state.getUserRole);
  const [role, setRole] = useState<"Admin" | "User" | null>(null);

  useEffect(() => {
    setRole(getUserRole() as "Admin" | "User" | null);
  }, [userToken, getUserRole]);

  return (
    <div className="flex w-full justify-center px-2">
      <nav className="bg-custom-bg-dark-1 backdrop-blur-xs text-white border border-[#393e46] rounded-xl z-50 w-full max-w-[95vw] md:w-[65vw]">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold hover:text-custom-primary transition duration-200 flex items-center gap-2"
          >
            <Rotate3DIcon
              className="size-8 animate-pulse"
              strokeWidth={1.5}
              color="#00ADB5"
            />
            <span className="text-[#00ADB5]">SyncSpace</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLinks userToken={userToken} role={role} />
          </div>

          <button
            className="md:hidden cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <XIcon className="size-6" />
            ) : (
              <MenuIcon className="size-6" />
            )}
          </button>
        </div>

        <div
          className={clsx(
            "md:hidden px-4 flex flex-col gap-3 overflow-hidden transition-all duration-300 ease-in-out",
            isOpen
              ? "max-h-[500px] opacity-100 scale-100 pb-4"
              : "max-h-0 opacity-0 scale-95 pointer-events-none"
          )}
        >
          <NavLinks userToken={userToken} role={role} />
        </div>
      </nav>
    </div>
  );
};

const NavLinks = ({
  userToken,
  role,
}: {
  userToken: string | null;
  role: "Admin" | "User" | null;
}) => {
  return (
    <>
      <Link
        href="/"
        className="hover:text-custom-primary transition duration-200"
      >
        Home
      </Link>
      <Link
        href="/space"
        className="hover:text-custom-primary transition duration-200"
      >
        My Space
      </Link>
      <Link
        href="/join"
        className="hover:text-custom-primary transition duration-200"
      >
        Join
      </Link>

      {role === "Admin" && (
        <Link
          href="/admin"
          className="hover:text-custom-primary transition duration-200"
        >
          Admin Options
        </Link>
      )}

      {userToken ? (
        <>
          <Link
            href="/profile"
            className="px-5 py-1 rounded-full border border-custom-primary text-white hover:bg-custom-primary transition duration-200 text-center"
          >
            Change Avatar
          </Link>
          <button
            className="bg-custom-primary hover:bg-custom-accent cursor-pointer text-white px-5 py-1 rounded-full transition duration-200"
            onClick={() => {
              useUserStore.getState().setUserToken("");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link
          href="/login"
          className="bg-custom-primary hover:bg-custom-accent cursor-pointer text-white px-5 py-1 rounded-full transition duration-200 text-center w-30"
        >
          Login
        </Link>
      )}
    </>
  );
};

export default Navbar;
