import { ClassModel } from './class-model';
import { AcademicYear } from './academic-year';
import {User} from "../../auth/models/user";

export interface StudentSession {
  id: number;
  student_id: number;
  academic_year_id: number;
  class_model_id: number;
  created_at: string;
  updated_at: string;
  class_model: ClassModel;
  student: {
    id: number;
    matricule: string;
    academic_records: string;
    class_model_id: number;
    parent_model_id: number;
    user_model_id: number;
    created_at: string;
    updated_at: string;
    user_model: User;
  };
}
