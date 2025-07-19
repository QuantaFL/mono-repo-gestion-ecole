import {User} from "../../auth/models/user";

export interface Teacher {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  hireDate: string;
  user?:User
  createdAt?: string;
  updatedAt?: string;
}
