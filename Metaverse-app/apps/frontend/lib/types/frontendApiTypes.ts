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

export type IAvatarSelection = {
  id: string;
  name: string | null;
  imageUrl: {
    standingDown: string;
  };
};

export interface ILoginResponse {
  token: string;
}

export interface IGetAllAvatarSelectionResponse {
  avatars: IAvatarSelection[];
}

export interface IUpdateUserAvatarResponse {
  success: string;
  message: string;
}

export interface ICreateAvatar {
  name: string
}