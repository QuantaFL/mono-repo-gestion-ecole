import { StudentSession } from './student-session';
import { UserModel } from "./user-model";
import { Parent } from "./parent";

export interface Student {
  id: number;
  matricule: string;
  created_at: string;
  updated_at: string;
  parent_model_id: number;
  user_model_id: number;
  latest_student_session: StudentSession | null;
  parentModel?: Parent;
  userModel: UserModel;
  academic_records_url: string;
}