import z from "zod";

export const SignUpSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  type: z.enum(["admin", "user"]),
});

export const SignInSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const UpdateMetadataSchema = z.object({
  avatarId: z.string(),
});

export const CreateSpaceSchema = z.object({
  name: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  mapId: z.string().optional(),
  thumbnail: z.string().optional(),
});

export const AddSpaceElementSchema = z.object({
  elementId: z.string(),
  spaceId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const CreateElementSchema = z.object({
  imageUrl: z.string(),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});

export const DeleteSpaceElementSchema = z.object({
  id: z.string(),
});

export const UpdateThumbnailToSpaceSchema = z.object({
  spaceId: z.string(),
  imageUrl: z.string(),
});

export const UpdateElementSchema = z.object({
  imageUrl: z.string(),
});

const avatarImageShape = {
  standingDown: z.string(),
  walkingDown1: z.string(),
  walkingDown2: z.string(),

  standingLeft: z.string(),
  walkingLeft1: z.string(),
  walkingLeft2: z.string(),

  standingRight: z.string(),
  walkingRight1: z.string(),
  walkingRight2: z.string(),

  standingUp: z.string(),
  walkingUp1: z.string(),
  walkingUp2: z.string(),
};

export const CreateAvatarSchema = z.object({
  imageUrls: z.object(avatarImageShape),
  name: z.string(),
});

export const UpdateAvatarSchema = z.object({
  imageUrls: z
    .object(
      Object.fromEntries(
        Object.entries(avatarImageShape).map(([key, schema]) => [
          key,
          schema.optional(),
        ])
      )
    )
    .refine((urls) => Object.values(urls).some((url) => url !== undefined)),
});

export const CreateAvatarImagesSchema = z.object(avatarImageShape);

export const CreateMapSchema = z.object({
  thumbnail: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  name: z.string(),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
});
