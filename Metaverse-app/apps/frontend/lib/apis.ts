import axios from "axios";
import {
  IAvatarSelection,
  IAuthParams,
  IGetAllAvatarSelectionResponse,
  ILoginResponse,
  IUpdateUserAvatarResponse,
} from "./types/frontendApiTypes";
import { Element } from "@repo/common/schema-types";

import {
  CreateAvatarSchema,
  CreateElementSchema,
} from "@repo/common/api-types";
import { z } from "zod";

const BACKEND_URL = "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: BACKEND_URL,
});

export const RegisterUserAPI = async ({ username, password }: IAuthParams) => {
  const response = await api.post("/auth/signup", {
    username,
    password,
    type: "user",
  });

  return response;
};

export const LoginUserAPI = async ({ username, password }: IAuthParams) => {
  const response = await api.post<ILoginResponse>("/auth/signin", {
    username,
    password,
  });

  return response;
};

export const GetAllAvatars = async (): Promise<IAvatarSelection[]> => {
  const response = await api.get<IGetAllAvatarSelectionResponse>("/avatars");
  return response.data.avatars as IAvatarSelection[];
};

export const UpdateUserAvatar = async (token: string, avatarId: string) => {
  const response = await api.post<IUpdateUserAvatarResponse>(
    "/user/metadata",
    {
      avatarId,
    },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const CreateAvatarAPI = async (
  token: string,
  data: z.infer<typeof CreateAvatarSchema>
) => {
  const response = await api.post("/admin/avatar", data, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const CreateElementAPI = async (
  token: string,
  data: z.infer<typeof CreateElementSchema>
) => {
  const response = await api.post("/admin/element", data, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  return response;
};

export const GetAllAvatarsAPI = async () => {
  const response = await api.get<Element[]>("/elements");
  return response;
};
