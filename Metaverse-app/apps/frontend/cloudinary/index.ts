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

export const DeleteSpaceThumbnailFromCloudinary = async (imageUrl: string) => {
  const imageId = imageUrl.split("/").pop()?.split(".")[0];

  if (!imageId) {
    console.error("Invalid image URL.");
    throw new Error("Image can't be found");
  }

  const response = await axios.post(
    `${CLOUDINARY_API}/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      public_id: imageId,
      upload_preset: CLOUDINARY_SPACE_FOLDER,
      invalidate: true,
    }
  );
};

export const DuplicateMapThumbnailFromCloudinaryIntoSpace = async (
  imageUrl: string
) => {
  const publicId = imageUrl.split("/").pop()?.split(".")[0];

  if (!publicId) {
    console.error("Invalid image URL, could not extract public ID.");
    throw new Error("Image can't be found");
  }

  try {
    const response = await axios.post(
      `${CLOUDINARY_API}/${CLOUDINARY_CLOUD_NAME}/image/copy`,
      {
        public_id: publicId,
        from_folder: CLOUDINARY_MAP_FOLDER,
        to_folder: CLOUDINARY_SPACE_FOLDER,
      }
    );

    // AssumingF successful response, construct the new URL
    const newUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${CLOUDINARY_SPACE_FOLDER}/${publicId}.jpg`;

    return newUrl;
  } catch (err) {
    console.error("Error duplicating image:", err);
    throw new Error("Image can't be copied ");
  }
};
