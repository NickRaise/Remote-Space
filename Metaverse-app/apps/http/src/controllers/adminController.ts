import z from "zod";
import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  UpdateElementSchema,
} from "@repo/common/api-types";
import { Response } from "express";
import {
  CreateAvatar,
  CreateAvatarImages,
  CreateElement,
  CreateMap,
  UpdateElement,
} from "../service/adminService";

export const CreateElementController = async (
  elementData: z.infer<typeof CreateElementSchema>,
  res: Response
) => {
  try {
    const createdElement = await CreateElement(elementData);

    return res.status(200).json({
      message: "Element created successfully.",
      id: createdElement.id,
    });
  } catch (err) {
    console.log("Error while creating element: ", err);
    return res.status(500).json({ message: err });
  }
};

export const UpdateElementController = async (
  elementData: z.infer<typeof UpdateElementSchema>,
  elementId: string,
  res: Response
) => {
  try {
    await UpdateElement(elementData.imageUrl, elementId);

    res.status(200).json({ message: "Element updated" });
  } catch (err) {
    console.log("Error updating avatar: ", err);
    return res.status(500).json({ message: err });
  }
};

export const CreateAvatarController = async (
  avatarData: z.infer<typeof CreateAvatarSchema>,
  res: Response
) => {
  try {
    const avatarImages = await CreateAvatarImages(avatarData.imageUrls)
    const avatar = await CreateAvatar(avatarData.name, avatarImages.id);

    res.status(200).json({ message: "Avatar created.", avatarId: avatar.id });
  } catch (err) {
    console.log("Error creating avatar: ", err);
    return res.status(500).json({ message: err });
  }
};

export const CreateMapController = async (mapData: z.infer<typeof CreateMapSchema>, res: Response) => {
  try {
    const map = await CreateMap(mapData)

    res.status(200).json({ message: "Map created.", id: map.id });
  } catch(err) {
    console.log("Error creating map: ", err);
    return res.status(500).json({ message: err });
  }
}