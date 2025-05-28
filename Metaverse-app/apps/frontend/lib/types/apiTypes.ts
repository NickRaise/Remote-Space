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
