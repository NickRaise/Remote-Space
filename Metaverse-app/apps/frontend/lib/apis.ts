import axios from "axios";
import {
  Avatar,
  IAuthParams,
  IGetAllAvatarResponse,
  ILoginResponse,
  IUpdateAvatarResponse,
} from "./types/apiTypes";

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

export const GetAllAvatars = async (): Promise<Avatar[]> => {
  const response = await api.get<IGetAllAvatarResponse>("/avatars");
  return response.data.avatars as Avatar[];
};

export const UpdateUserAvatar = async (token: string, avatarId: string) => {
  const response = await api.post<IUpdateAvatarResponse>(
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
