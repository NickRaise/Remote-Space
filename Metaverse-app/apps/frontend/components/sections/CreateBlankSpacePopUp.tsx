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
import { CreateSpaceAPI } from "@/lib/apis";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CreateBlankSpacePopUp = () => {
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const [name, setName] = useState<string>("Custom Space");
  const [width, setWidth] = useState<number>(40);
  const [height, setHeight] = useState<number>(25);
  const userToken = useUserStore().userToken;
  const router = useRouter();

  const createBlankSpace = async () => {
    if (!userToken) return;

    try {
      const spaceCreationData = {
        name,
        dimensions: `${width}x${height}`,
      };
      const response = await CreateSpaceAPI(userToken, spaceCreationData);
      console.log(response.data);
      toast("Space creation success. Redirecting to editor...");
      router.push(`/space/${response.data.spaceId}`);
    } catch (err) {
      console.log(err);
      toast("Space creation failed. Try again...");
    }
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
            className="border bg-custom-bg-dark-2 border-custom-border-highlight text-custom-border-highlight hover:bg-custom-bg-dark-2 hover:scale-105 transition-all cursor-pointe hover:text-custom-highlight cursor-pointer"
          >
            + Create Empty Space
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-custom-bg-dark-1 text-custom-text-primary outline-none border-none rounded-2xl">
          <DialogHeader>
            <DialogTitle>Set Space Data</DialogTitle>
            <DialogDescription className="text-custom-text-secondary flex justify-between w-full">
              1 unit = 80px.
              <span>Min value is 10 unit</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
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
                onClick={createBlankSpace}
                className="bg-custom-primary hover:bg-custom-accent text-white font-medium py-2 rounded-lg transition-all cursor-pointer"
              >
                Proceed
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateBlankSpacePopUp;
