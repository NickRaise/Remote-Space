import { Response } from "express";
import { UpdateMetadata } from "../service/userService";

export const UpdateUserMetadata = async (
  userId: string,
  avatarId: string,
  res: Response
) => {
  try {
    await UpdateMetadata(userId, avatarId);
    res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
