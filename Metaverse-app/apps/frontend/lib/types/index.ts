import { Element } from "@repo/common/schema-types";
import z from "zod";

export interface IMapElements {
  element: Element;
  elementId: string;
  x: number;
  y: number;
}

export interface IAllSpaceResponse {
  id: string;
  name: string;
  thumbnail: string;
  dimensions: string;
}

export interface IGetSpaceByIdResponse {
  thumbnail: string;
  dimensions: string;
  spaceElements: {
    id: string;
    element: {
      id: string;
      imageUrl: string;
      height: number;
      width: number;
      static: boolean;
    };
    x: number;
    y: number;
  }[];
}

export interface IGetUsersMetadata {
  avatars: {
    userId: string;
    avatarId: IAvatarImages;
  }[];
}

export interface IAvatarImages {
  id: string;
  standingDown: String;
  walkingDown1: String;
  walkingDown2: String;

  standingLeft: String;
  walkingLeft1: String;
  walkingLeft2: String;

  standingRight: String;
  walkingRight1: String;
  walkingRight2: String;

  standingUp: String;
  walkingUp1: String;
  walkingUp2: String;
}

export const IMAGE_FILE = z
  .instanceof(File, { message: "Please upload a valid image file." })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed.",
  })
  .refine((file) => file.size > 0, {
    message: "Image is required.",
  });
