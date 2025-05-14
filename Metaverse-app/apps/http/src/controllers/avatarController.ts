import { Response } from "express";
import { GetAllAvatars } from "../service/avatarService";

export const GetAvatarsController = async (res: Response) => {
  try {
    const avatars = await GetAllAvatars();

    return res.status(200).json({ avatars });
  } catch (err) {
    console.log("Error fetching avatars: ", err);
    return res.status(500).json({ message: err });
  }
};
