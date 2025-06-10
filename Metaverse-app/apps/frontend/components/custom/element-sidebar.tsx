import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Element } from "@repo/common/schema-types";
import { GetAllAvatarsAPI } from "@/lib/apis";
import Image from "next/image";

const AllElementsSidebar = ({
  setElementId,
}: {
  setElementId: Dispatch<SetStateAction<Element | null>>;
}) => {
  const [allElements, setAllElements] = useState<Element[]>();

  const fetchAllElements = async () => {
    try {
      const response = await GetAllAvatarsAPI();
      setAllElements(response.data);
      console.log(allElements);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllElements();
  }, []);

  return (
    <div className="h-screen overflow-y-scroll w-[10vw] p-4">
      {allElements?.map((e) => (
        <Image
          key={e.id}
          src={e.imageUrl}
          width={80}
          height={80}
          alt="element image"
        />
      ))}
    </div>
  );
};

export default AllElementsSidebar;
