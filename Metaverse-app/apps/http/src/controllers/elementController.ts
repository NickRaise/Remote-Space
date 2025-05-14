import { Response } from "express";
import { GetAllElements } from "../service/avatarSerice";

export const GetElementsController = async (res: Response) => {
  try {
    const elements = await GetAllElements();
    res.status(200).json(elements);
  } catch (err) {
    console.log("Error fetching elements: ", err);
    return res.status(500).json({ message: err });
  }
};
