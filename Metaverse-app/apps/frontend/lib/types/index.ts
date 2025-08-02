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
  standingDown: string;
  walkingDown1: string;
  walkingDown2: string;

  standingLeft: string;
  walkingLeft1: string;
  walkingLeft2: string;

  standingRight: string;
  walkingRight1: string;
  walkingRight2: string;

  standingUp: string;
  walkingUp1: string;
  walkingUp2: string;
}

export const IMAGE_FILE = z
  .instanceof(File, { message: "Please upload a valid image file." })
  .refine((file) => file.type.startsWith("image/"), {
    message: "Only image files are allowed.",
  })
  .refine((file) => file.size > 0, {
    message: "Image is required.",
  });
