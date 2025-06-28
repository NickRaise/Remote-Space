import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { CloudUpload, LucideLoader2 } from "lucide-react";
import clsx from "clsx";

export const SaveButton = ({
  label,
  onClick,
  loading,
  className,
}: {
  label: string;
  onClick: () => void;
  loading: boolean;
  className?: string;
}) => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutsideInput = (e: MouseEvent) => {
      if (
        triggerButtonRef.current &&
        !triggerButtonRef.current.contains(e.target as Node)
      ) {
        triggerButtonRef.current.blur();
      }
    };
    document.addEventListener("mousedown", handleClickOutsideInput);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInput);
    };
  }, []);

  return (
    <div>
      <Button
        disabled={loading}
        onClick={onClick}
        ref={triggerButtonRef}
        type="button"
        className={clsx(
          "w-24 cursor-pointer bg-custom-primary hover:bg-custom-accent flex items-center justify-center gap-2",
          className
        )}
      >
        {loading ? (
          <>
            <LucideLoader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            <span>{label}</span>
            <CloudUpload className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
