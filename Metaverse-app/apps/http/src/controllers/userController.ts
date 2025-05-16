import { Response } from "express";
import { GetAvatarByIds, UpdateMetadata } from "../service/userService";
import { PrismaClientKnownRequestError } from "../../../../packages/db/prisma/generated/prisma/runtime/library";

export const UpdateUserMetadata = async (
  userId: string,
  avatarId: string,
  res: Response
) => {
  try {
    await UpdateMetadata(userId, avatarId);
    res.status(200).json({ success: true, message: "Updated successfully" });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2003") {
          return res.status(400).json({
            success: false,
            message: "Cannot find avatar.",
          });
        }
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
