import z from "zod";
import { SignUpSchema } from "../types";
import { IUser } from "../types/modelsTypes";
export declare const CreateUser: (userData: z.infer<typeof SignUpSchema>) => Promise<IUser>;
export declare const findUser: (username: string) => Promise<IUser | null>;
export declare const hashPassword: (password: string) => Promise<string>;
export declare const isPasswordCorrect: (password: string, hash: string) => Promise<Boolean>;
//# sourceMappingURL=userService.d.ts.map