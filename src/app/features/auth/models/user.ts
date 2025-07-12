export interface User {
  id: number;
  firstName: string;
  lastName: string;
  adresse:string;
  dateOfBirth:string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  rememberToken?: string;
  createdAt?: string;
  updatedAt?: string;
}
