import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef } from "react";

const MapDimensionSetting = ({
  width,
  setWidth,
  height,
  setHeight,
  reRenderMap,
}: {
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
  height: number;
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  reRenderMap: () => void;
}) => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const populateValuesToMap = (e: React.MouseEvent<HTMLButtonElement>) => {
    reRenderMap();
  };

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
    <Dialog>
      <form className="">
        <DialogTrigger asChild>
          <Button
            ref={triggerButtonRef}
            variant="outline"
            className="bg-custom-highlight text-custom-bg-dark-1 font-semibold cursor-pointer outline-none border-none hover:bg-custom-accent hover:text-custom-text-primary"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            Dimensions
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-custom-bg-dark-1 text-custom-text-primary outline-none border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle>Set Map Dimensions</DialogTitle>
            <DialogDescription className="text-custom-text-secondary flex justify-between w-full">
              1 unit = 80px.
              <span>Min value is 10 unit</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Width</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue <= 100) {
                    setWidth(newValue);
                  }
                }}
                placeholder="Width"
                className="w-full rounded-md border border-gray-600 bg-custom-bg-dark-2 px-3 py-2 text-custom-text-primary transition focus:outline-none"
                style={{
                  borderColor: "transparent",
                  boxShadow: `0 0 0 2px transparent`,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF2E63"; // Accent pink
                  e.target.style.boxShadow = "0 0 8px #FF2E63";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#555"; // fallback border color
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Height</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue <= 100) {
                    setHeight(newValue);
                  }
                }}
                placeholder="Height"
                className="w-full rounded-md border border-gray-600 bg-custom-bg-dark-2 px-3 py-2 text-custom-text-primary transition focus:outline-none"
                style={{
                  borderColor: "transparent",
                  boxShadow: `0 0 0 2px transparent`,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FF2E63"; // Accent pink
                  e.target.style.boxShadow = "0 0 8px #FF2E63";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#555"; // fallback border color
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="cursor-pointer text-custom-text-primary hover:text-custom-text-primary bg-custom-bg-dark-2 border-transparent hover:bg-custom-bg-dark-2 hover:border-custom-text-primary"
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={populateValuesToMap}
                className="bg-custom-primary hover:bg-custom-accent text-white font-medium py-2 rounded-lg transition-all cursor-pointer"
              >
                Save changes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default MapDimensionSetting;
