import z from "zod";
import { SignInSchema, SignUpSchema } from "../types";
import { Response } from "express";
export declare const SignUpUser: (userData: z.infer<typeof SignUpSchema>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const SignInUser: (userData: z.infer<typeof SignInSchema>, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map