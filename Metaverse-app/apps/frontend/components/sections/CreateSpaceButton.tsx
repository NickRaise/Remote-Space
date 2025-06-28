import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetAllMapsAPI } from "@/lib/apis";
import { Map } from "@repo/common/schema-types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUserStore } from "@/store/userStore";
import CreateBlankSpacePopUp from "./CreateBlankSpacePopUp";

const CreateSpaceMenu = () => {
  const [maps, setMaps] = useState<Map[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null);
  const userToken = useUserStore().userToken;

  const fetchAllMaps = async () => {
    try {
      const response = await GetAllMapsAPI();
      setMaps(response.data.maps);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllMaps();
  }, []);

  const createSpace = () => {
    if (!selectedMapId || !userToken) return;

    try {

    }catch(err) {
      console.log(err)
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-custom-primary hover:bg-custom-accent text-custom-text-primary hover:text-custom-text-primary border-none transition-all duration-300 cursor-pointer font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm h-9 px-4 py-2">
          <Plus className="w-4 h-4" /> Create Space
        </div>
      </DialogTrigger>

      <DialogContent className="min-w-[80vw] p-6 bg-custom-bg-dark-1 border border-black shadow-lg text-custom-text-primary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            <div className="flex justify-between items-center px-4 py-2">
              <div className="text-lg font-semibold text-custom-text-primary">
                Select a Template Map
              </div>
              <CreateBlankSpacePopUp />
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 max-h-[60vh] px-4 mt-4">
          {maps.length > 0 ? (
            maps.map((map) => (
              <div
                key={map.id}
                onClick={() => setSelectedMapId(map.id)}
                className={clsx(
                  "bg-custom-bg-dark-2 border-2 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col shadow-md hover:shadow-custom-primary/50 hover:scale-105",
                  selectedMapId === map.id
                    ? "border-custom-border-highlight ring-1 ring-custom-border-highlight"
                    : "border-transparent"
                )}
              >
                <div className="relative w-full h-56 bg-muted">
                  <Image
                    src={map.thumbnail}
                    alt={map.name}
                    fill
                    className="object-cover object-center"
                  />
                </div>
                <div className="px-4 py-2 text-md text-center text-custom-text-primary">
                  {map.name}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-muted-foreground">
              No maps found.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => setSelectedMapId(null)}
              className="cursor-pointer text-custom-text-primary hover:text-custom-text-primary bg-custom-bg-dark-2 border-transparent hover:bg-custom-bg-dark-2 hover:border-custom-text-primary"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={!selectedMapId}
              onClick={createSpace}
              className={clsx(
                "bg-custom-primary hover:bg-custom-accent text-white font-medium py-2 rounded-lg transition-all cursor-pointer disabled:bg-custom-bg-dark-2",
                !selectedMapId && "opacity-50 cursor-not-allowed"
              )}
            >
              Select
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpaceMenu;
