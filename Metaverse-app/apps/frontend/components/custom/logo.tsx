import { Rotate3DIcon } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Rotate3DIcon className="size-8" strokeWidth={1.5} />
      <span className="text-lg font-semibold">SyncSpace</span>
    </Link>
  );
};

export default Logo;
