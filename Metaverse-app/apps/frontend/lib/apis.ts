import axios from "axios";
import {
  IAvatarSelection,
  IAuthParams,
  IGetAllAvatarSelectionResponse,
  ILoginResponse,
  IUpdateUserAvatarResponse,
} from "./types/frontendApiTypes";
import { Element, Map } from "@repo/common/schema-types";

import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
} from "@repo/common/api-types";
import { z } from "zod";
import { IAllSpaceResponse } from "./types";

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

export const CreateMapAPI = async (
  token: string,
  data: z.infer<typeof CreateMapSchema>
) => {
  const response = await api.post<{ id: string; message: string }>(
    "/admin/map",
    data,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

export const GetAllMapsAPI = async () => {
  const response = await api.get<{ maps: Map[] }>("/maps");
  return response;
};

export const GetMySpacesAPI = async (token: string) => {
  const response = await api.get<{ spaces: IAllSpaceResponse[] }>(
    "/space/all",
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};
