import { CLOUDINARY_API, CLOUDINARY_CLOUD_NAME } from "@/lib/constant";
import axios from "axios";

export const UploadToCloudinary = async (
  file: string,
  folder: string
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
