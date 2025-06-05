export interface IAuthParams {
  username: string;
  password: string;
}

export interface IRegisterResponse {
  userId: string;
  message: string;
  success: boolean;
}

export interface ILoginResponse {
  token: string;
}

export type Avatar = {
  id: string;
  name: string | null;
  imageUrl: {
    standingDown: string;
  };
};

export interface ILoginResponse {
  token: string;
}

export interface IGetAllAvatarResponse {
  avatars: Avatar[];
}

export interface IUpdateAvatarResponse {
  success: string;
  message: string;
}
