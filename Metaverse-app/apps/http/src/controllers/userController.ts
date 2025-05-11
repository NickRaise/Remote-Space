import { Response } from "express";
import { GetAvatarByIds, UpdateMetadata } from "../service/userService";

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

export const GetMetaDataByIds = async (ids: string[], res: Response) => {
  try {
    const metadata = await GetAvatarByIds(ids);

    res.status(200).json({
      avatars: metadata.map((m) => ({
        userId: m.id,
        avatarId: m.avatar?.imageUrl,
      })),
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
