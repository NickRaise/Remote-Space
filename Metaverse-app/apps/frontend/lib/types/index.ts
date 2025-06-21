import { Element } from "@repo/common/schema-types";
import z from "zod";

export interface IMapElements {
  element: Element;
  elementId: string;
  x: number;
  y: number;
}

export const IMAGE_FILE = z
  .instanceof(File, { message: "Please upload a valid image file." })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed.",
  })
  .refine((file) => file.size > 0, {
    message: "Image is required.",
  });
