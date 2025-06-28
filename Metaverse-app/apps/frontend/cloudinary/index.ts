import {
  CLOUDINARY_API,
  CLOUDINARY_AVATAR_FOLDER,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_ELEMENT_FOLDER,
  CLOUDINARY_MAP_FOLDER,
  CLOUDINARY_SPACE_FOLDER,
} from "@/lib/constant";
import axios from "axios";

type CloudinaryFolderType =
  | typeof CLOUDINARY_MAP_FOLDER
  | typeof CLOUDINARY_AVATAR_FOLDER
  | typeof CLOUDINARY_ELEMENT_FOLDER
  | typeof CLOUDINARY_SPACE_FOLDER;

export const UploadToCloudinary = async (
  file: string | File,
  folder: CloudinaryFolderType
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", folder);

  try {
    const response = await axios.post<{ secure_url: string }>(
      `${CLOUDINARY_API}/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (err) {
    console.log(err);
    return null;
  }
};
