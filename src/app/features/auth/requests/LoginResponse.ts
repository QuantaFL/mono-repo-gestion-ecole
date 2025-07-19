export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role_id: number;
  };
  message: string;
  success: boolean;
}
