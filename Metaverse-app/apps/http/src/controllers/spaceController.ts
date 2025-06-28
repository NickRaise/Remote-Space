import { Response } from "express";
import {
  AddSpaceElementSchema,
  CreateSpaceSchema,
  DeleteSpaceElementSchema,
  UpdateThumbnailToSpaceSchema,
} from "@repo/common/api-types";
import z from "zod";
import {
  CreateSpaceWithMapId,
  CreateSpaceWithoutMapId,
  DeleteSpaceById,
  FindMapById,
  FindSpaceById,
  FindSpaceByIdAndCreator,
  GetAllSpacesById,
  GetSpaceDataById,
  UpdateThumbnail,
} from "../service/spaceService";
import { Prisma } from "../../../../packages/db/prisma/generated/prisma";
import {
  CreateSpaceElement,
  DeleteSpaceElementById,
  FindSpaceElementById,
} from "../service/spaceElementService";

export const CreateSpaceController = async (
  spaceData: z.infer<typeof CreateSpaceSchema>,
  userId: string,
  res: Response
) => {
  try {
    if (!spaceData.mapId) {
      const space = await CreateSpaceWithoutMapId(spaceData, userId);
      return res.status(200).json({
        spaceId: space.id,
        message: "Space created successfully without a map.",
      });
    }

    const map = await FindMapById(spaceData.mapId);
    if (!map) {
      return res.status(404).json({
        message: "Map not found. Cannot create space with an invalid mapId.",
      });
    }

    const space = await CreateSpaceWithMapId(spaceData, map, userId);
    return res.status(200).json({
      spaceId: space.id,
      message: "Space created successfully with a map.",
    });
  } catch (err) {
    console.error("Error creating space:", err);

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: "Prisma error: " + err.message });
    }

    return res
      .status(500)
      .json({ message: "Internal server error while creating space." });
  }
};

export const DeleteSpaceController = async (
  spaceId: string,
  userId: string,
  res: Response
) => {
  try {
    const space = await FindSpaceById(spaceId);

    if (!space) {
      res.status(400).json({ message: "Space not found" });
      return;
    }

    if (space.creatorId !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await DeleteSpaceById(spaceId);
    res.status(200).json({
      message: "Space deleted",
    });
  } catch (err) {
    console.log("Error deleting space: ", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: "Prisma error: " + err.message });
    }
    return res
      .status(500)
      .json({ message: "Internal server error while creating space." });
  }
};

export const GetAllSpacesController = async (userId: string, res: Response) => {
  try {
    const spaces = await GetAllSpacesById(userId);

    res.status(200).json({
      spaces: spaces.map((s) => ({
        id: s.id,
        name: s.name,
        thumbnail: s.thumbnail,
        dimensions: `${s.width}x${s.height}`,
      })),
    });
    return;
  } catch (err) {
    console.log("Error getting all spaces: ", err);
    return res
      .status(500)
      .json({ message: "Internal server error while creating space." });
  }
};

export const AddSpaceElementController = async (
  elementData: z.infer<typeof AddSpaceElementSchema>,
  userId: string,
  res: Response
) => {
  try {
    const space = await FindSpaceByIdAndCreator(elementData.spaceId, userId);

    if (!space) {
      res.status(400).json({ message: "Space not found" });
      return;
    }

    if (
      elementData.x < 0 ||
      elementData.y < 0 ||
      elementData.x > space.width ||
      elementData.y > space.height
    ) {
      res.status(400).json({ message: "Position is outside of space" });
      return;
    }

    const spaceElement = await CreateSpaceElement(elementData);

    res.status(200).json({ id: spaceElement.id, message: "Element added" });
  } catch (err) {
    console.log("Error adding element to a space: ", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: "Prisma error: " + err.message });
    }
    return res
      .status(500)
      .json({ message: "Internal server error while creating space." });
  }
};

export const DeleteSpaceElementController = async (
  { id }: z.infer<typeof DeleteSpaceElementSchema>,
  userId: string,
  res: Response
) => {
  try {
    const spaceElement = await FindSpaceElementById(id);

    if (!spaceElement) {
      res.status(400).json({ message: "This space element does not exists" });
      return;
    }

    if (spaceElement.space.creatorId !== userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await DeleteSpaceElementById(id);

    res.status(200).json({ message: "Element deleted" });
  } catch (err) {
    console.log("Error deleting space element: ", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: "Prisma error: " + err.message });
    }
    return res
      .status(500)
      .json({ message: "Internal server error while creating space." });
  }
};

export const GetSpacesController = async (spaceId: string, res: Response) => {
  try {
    const space = await GetSpaceDataById(spaceId);
    if (!space) {
      res.status(400).json({ message: "Space not found" });
      return;
    }

    res.status(200).json({
      thumbnail: space.thumbnail,
      dimensions: `${space.width}x${space.height}`,
      spaceElements: space.spaceElements.map((e) => ({
        id: e.id,
        element: {
          id: e.element.id,
          imageUrl: e.element.imageUrl,
          height: e.element.height,
          width: e.element.width,
          static: e.element.static,
        },
        x: e.x,
        y: e.y,
      })),
    });
  } catch (err) {
    console.log("Error deleting space element: ", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return res.status(400).json({ message: "Prisma error: " + err.message });
    }
    return res
      .status(500)
      .json({ message: "Internal server error while creating space." });
  }
};

export const UpdateThumbnailController = async (
  data: z.infer<typeof UpdateThumbnailToSpaceSchema>,
  userId: string,
  res: Response
) => {
  const space = await FindSpaceByIdAndCreator(data.spaceId, userId);

  if (!space) {
    res.status(400).json({ message: "Space not found" });
    return;
  }

  if (space.creatorId !== userId) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  await UpdateThumbnail(data);
};
