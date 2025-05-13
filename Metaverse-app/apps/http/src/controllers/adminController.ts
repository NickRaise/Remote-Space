import z from "zod";
import { CreateElementSchema } from "../types";
import { Response } from "express";
import { CreateElement } from "../service/adminService";

export const CreateElementController = async (
  elementData: z.infer<typeof CreateElementSchema>,
  res: Response
) => {
  try {
    const createdElement = await CreateElement(elementData);

    return res
      .status(200)
      .json({
        message: "Element created successfully.",
        elementId: createdElement.id,
      });
  } catch (err) {
    console.log("Error while creating element: ", err);
    return res
      .status(500)
      .json({ message: "Internal server error while creating space." });
  }
};
