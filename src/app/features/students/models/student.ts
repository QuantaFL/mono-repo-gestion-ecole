import {User} from "../../auth/models/user";
import {ClassModel} from "../../class/models/class";

export interface Student {
  id: number;
  userId: number;
  user?:User;
  enrollmentDate: string;
  classId: number;
  parentUserId: number;
  parentUser?:User;
  matricule:String;
  classModel?:ClassModel;
  studentIdNumber: string;
  createdAt?: string;
  updatedAt?: string;
}
