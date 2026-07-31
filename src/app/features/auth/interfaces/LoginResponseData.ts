export interface LoginResponseData {
  token: string;
  refreshToken: string;
  type: string;
  expiresIn: number;
}