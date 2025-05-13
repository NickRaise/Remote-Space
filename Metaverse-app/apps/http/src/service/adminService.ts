import z from "zod"
import Prisma from "@repo/db/client";
import { CreateElementSchema } from "../types"

export const CreateElement = async (elementData: z.infer<typeof CreateElementSchema>) => {
    const element = await Prisma.element.create({
        data: elementData
    })

    return element
}