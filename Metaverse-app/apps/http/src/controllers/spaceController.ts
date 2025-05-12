import { Response } from "express";
import { AddElementSchema, CreateSpaceSchema } from "../types";
import z from "zod";
import {
  AddElementToASpace,
  CreateSpaceWithMapId,
  CreateSpaceWithoutMapId,
  DeleteSpaceById,
  FindMapById,
  FindSpaceById,
  FindSpaceByIdAndCreator,
  GetAllSpacesById,
} from "../service/spaceService";
import { Prisma } from "../../../../packages/db/prisma/generated/prisma";

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
        name: s.id,
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

export const AddElementController = async (
  elementData: z.infer<typeof AddElementSchema>,
  userId: string,
  res: Response
) => {
  try {
    const space = await FindSpaceByIdAndCreator(elementData.spaceId, userId);

    if (!space) {
      res.status(400).json({ message: "Space not found" });
      return;
    }

    await AddElementToASpace(elementData);

    res.status(200).json({ message: "Element added" });
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
