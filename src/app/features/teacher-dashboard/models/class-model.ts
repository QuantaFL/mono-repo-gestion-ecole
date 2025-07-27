import {StudentSession} from "./student-session";

export interface ClassModel {
  id?: number;
  name: string;
  level: string;
  latest_student_session: StudentSession | null;
  current_academic_year_student_sessions: StudentSession[];
  created_at?: string;
  updated_at?: string;
}
