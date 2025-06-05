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
  getUserId: () => null | string;
}

const userStore = (set: any, get: any): IUserStore => ({
  userToken: null,

  setUserToken: (token) => set(() => ({ userToken: token })),

  getUserId: () => {
    const token = get().userToken;
    if (!token) return null;

    const decoded = decode(token) as IDecodedToken | null;

    if (!decoded) return null;

    return decoded.userId;
  },
});

export const useUserStore = create<IUserStore>()(
  persist(userStore, {
    name: "user-storage",
  })
);
