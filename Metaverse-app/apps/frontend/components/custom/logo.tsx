import { Rotate3DIcon } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Rotate3DIcon className="size-8" strokeWidth={1.5} color="#00ADB5" />
      <span className="text-2xl font-bold text-[#00ADB5]">SyncSpace</span>
    </Link>
  );
};

export default Logo;
