// store/userStore.ts
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { decode } from "jsonwebtoken";

interface IDecodedToken {
  userId: string;
  role: "Admin" | "User";
}

interface IUserStore {
  userToken: string | null;
  hydrated: boolean;
  setUserToken: (token: string) => void;
  getUserId: () => string | null;
  getUserRole: () => "Admin" | "User" | null;
  setHydrated: (value: boolean) => void;
}

const userStore: StateCreator<IUserStore> = (set, get): IUserStore => ({
  userToken: null,
  hydrated: false,

  setUserToken: (token) => set(() => ({ userToken: token })),
  setHydrated: (value) => set(() => ({ hydrated: value })),

  getUserId: () => {
    const token = get().userToken;
    const decoded = decode(token || "") as IDecodedToken | null;
    return decoded?.userId ?? null;
  },

  getUserRole: () => {
    const token = get().userToken;
    const decoded = decode(token || "") as IDecodedToken | null;
    return decoded?.role ?? null;
  },
});

export const useUserStore = create<IUserStore>()(
  persist(userStore, {
    name: "user-storage",
    onRehydrateStorage: () => (state) => {
      state?.setHydrated(true);
    },
    version: 1,
  })
);