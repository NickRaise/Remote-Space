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
import { useState } from "react";

const MapDimensionSetting = () => {
  const [width, setWidth] = useState<number>(1600);
  const [height, setHeight] = useState<number>(1000);

  const populateValuesToMap = () => {};

  return (
    <Dialog>
      <form className="">
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-custom-highlight text-custom-bg-dark-1 font-semibold cursor-pointer outline-none border-none hover:bg-amber-400"
          >
            Dimensions
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-custom-bg-dark-1 text-custom-text-primary outline-none border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle>Set Map Dimensions</DialogTitle>
            <DialogDescription className="text-custom-text-secondary">
              1 unit = 80px
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Width</Label>
              <Input
                type="number"
                min={10}
                max={500}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
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
                min={10}
                max={500}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
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
            <Button
              onClick={populateValuesToMap}
              className="bg-custom-primary hover:bg-custom-accent text-white font-medium py-2 rounded-lg transition-all cursor-pointer"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default MapDimensionSetting;
