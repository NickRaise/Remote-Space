import { Response } from "express";
import { GetAllMaps } from "../service/mapService";

export const GetAllMapsController = async (res: Response) => {
  try {
    const maps = await GetAllMaps();

    return res.status(200).json({ maps });
  } catch (err) {
    console.log("Error fetching maps: ", err);
    return res.status(500).json({ message: err });
  }
};
