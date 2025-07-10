export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  roleId: number;
  rememberToken?: string;
  createdAt?: string;
  updatedAt?: string;
}
