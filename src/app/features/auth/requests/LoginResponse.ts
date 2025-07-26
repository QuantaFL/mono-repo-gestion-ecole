export interface LoginResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    birthday: string;
    email: string;
    adress: string;
    phone: string;
    role_id: number;
    role: {
      id: number;
      name: string;
    };
    created_at: string;
    updated_at: string;
    isFirstLogin: boolean;
  };
  token: string;
}
