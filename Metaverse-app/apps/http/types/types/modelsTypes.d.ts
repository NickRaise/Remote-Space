import { Role } from "@prisma/client";
export interface IUser {
    username: string;
    password: string;
    id: string;
    avatarId: string | null;
    role: Role;
}
//# sourceMappingURL=modelsTypes.d.ts.map