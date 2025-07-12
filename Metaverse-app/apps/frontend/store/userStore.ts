import { create, StateCreator } from "zustand";
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
  getUserRole: () => null | string;
}

const userStore: StateCreator<IUserStore> = (set, get): IUserStore => ({
  userToken: null,

  setUserToken: (token) => set(() => ({ userToken: token })),

  getUserId: () => {
    const token = get().userToken;
    if (!token) return null;

    const decoded = decode(token) as IDecodedToken | null;

    if (!decoded) return null;

    return decoded.userId;
  },

  getUserRole: () => {
    const token = get().userToken;
    if (!token) return null;

    const decoded = decode(token) as IDecodedToken | null;
    return decoded?.role || null;
  },
});

export const useUserStore = create<IUserStore>()(
  persist(userStore, {
    name: "user-storage",
  })
);
