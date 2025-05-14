import z from "zod";
import { CreateElementSchema, UpdateElementSchema } from "../types";
import { Response } from "express";
import { CreateElement, UpdateElement } from "../service/adminService";

export const CreateElementController = async (
  elementData: z.infer<typeof CreateElementSchema>,
  res: Response
) => {
  try {
    const createdElement = await CreateElement(elementData);

    return res.status(200).json({
      message: "Element created successfully.",
      id: createdElement.id,
    });
  } catch (err) {
    console.log("Error while creating element: ", err);
    return res.status(500).json({ message: err });
  }
};

export const UpdateElementController = async (
  elementData: z.infer<typeof UpdateElementSchema>,
  elementId: string,
  res: Response
) => {
  try {
    await UpdateElement(elementData.imageUrl, elementId);

    res.status(200).json({ message: "Element updated" });
  } catch (err) {
    console.log("Error updating avatar: ", err);
    return res.status(500).json({ message: err });
  }
};
