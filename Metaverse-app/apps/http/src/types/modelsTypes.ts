import { Role } from "../../../../packages/db/prisma/generated/prisma";

export interface IUser {
  username: string;
  password: string;
  id: string;
  avatarId: string | null;
  role: Role;
}
