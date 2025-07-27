import {User} from "../../auth/models/user";
import {ClassModel} from "../../class/models/class";
import {StudentSession} from "../../teacher-dashboard/models/student-session";


export interface Student {
  id: number;
  matricule: string;
  created_at: string;
  updated_at: string;
  parent_model_id: number;
  user_model_id: number;
  latest_student_session?: StudentSession;
  parentModel?: any;
  userModel?: any;
  academic_records_url?: string;
}
