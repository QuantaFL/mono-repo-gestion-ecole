import { UserModel } from "./user-model";
import { Student } from "./student";

export interface Parent {
  id: number;
  userModel: UserModel;
  children: Student[];
}