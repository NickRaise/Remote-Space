import { Role } from "@prisma/client"; // Import the Role enum

export interface IUser {
  username: string;
  password: string;
  id: string;
  avatarId: string;
  role: Role;
}
