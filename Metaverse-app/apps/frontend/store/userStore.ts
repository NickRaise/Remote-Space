import { create } from "zustand";
import { persist } from "zustand/middleware";
import { decode } from "jsonwebtoken";

interface IDecodedToken {
  userId: string;
  role: "admin" | "user";
}

interface IUserStore {
  userToken: null | string;
  setUserToken: (token: string) => void;
  getUserAccess: () => null | [userId: string, role: string];
}

const userStore = (set: any, get: any): IUserStore => ({
  userToken: null,

  setUserToken: (token) => set(() => ({ userToken: token })),

  getUserAccess: () => {
    const token = get().userToken;
    if (!token) return null;

    const decoded = decode(token) as IDecodedToken | null;

    if (!decoded) return null;

    return [decoded.userId, decoded.role];
  },
});

const useUserStore = create<IUserStore>()(
  persist(userStore, {
    name: "user-storage",
  })
);
