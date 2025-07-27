import { Student } from "./student";

export interface StudentSession {
  id: number;
  student_id: number;
  class_model_id: number;
  academic_year_id: number;
  student?: Student;
  created_at: string;
  updated_at: string;
  justificatif_path?: string | null;
}

