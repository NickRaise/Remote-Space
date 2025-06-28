import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateSpaceAPI, GetAllMapsAPI } from "@/lib/apis";
import { Map } from "@repo/common/schema-types";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUserStore } from "@/store/userStore";
import CreateBlankSpacePopUp from "./CreateBlankSpacePopUp";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CreateSpaceMenu = () => {
  const [maps, setMaps] = useState<Map[]>([]);
  const [selectedMap, setSelectedMap] = useState<Map | null>(null);
  const userToken = useUserStore().userToken;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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

  const createSpace = async () => {
    if (!selectedMap || !userToken) return;

    try {
      setLoading(true);
      const data = {
        name: selectedMap.name,
        dimensions: `${selectedMap.width}x${selectedMap.height}`,
        mapId: selectedMap.id,
      };

      const response = await CreateSpaceAPI(userToken, data);
      toast("Space created successfully. Redirecting...");
      router.push(`/space/${response.data.spaceId}`);
    } catch (err) {
      console.log(err);
      toast("Space creation failed. Try again...");
    } finally {
      setLoading(false);
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
                onClick={() => {
                  setSelectedMap(map);
                }}
                className={clsx(
                  "bg-custom-bg-dark-2 border-2 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col shadow-md hover:shadow-custom-primary/50 hover:scale-105",
                  selectedMap?.id === map.id
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
              onClick={() => setSelectedMap(null)}
              className="cursor-pointer text-custom-text-primary hover:text-custom-text-primary bg-custom-bg-dark-2 border-transparent hover:bg-custom-bg-dark-2 hover:border-custom-text-primary"
            >
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              disabled={!selectedMap?.id || loading}
              onClick={createSpace}
              className={clsx(
                "bg-custom-primary hover:bg-custom-accent text-white font-medium py-2 rounded-lg transition-all cursor-pointer disabled:bg-custom-bg-dark-2",
                !selectedMap?.id && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? "Creating..." : "Select"}
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSpaceMenu;
