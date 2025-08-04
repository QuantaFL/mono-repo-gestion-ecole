import {StudentSession} from "./student-session";

export interface SubjectPivot {
  class_model_id: number;
  subject_id: number;
  created_at: string;
  updated_at: string;
}

export interface ClassSubject {
  id: number;
  name: string;
  level: string;
  coefficient: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  pivot?: SubjectPivot;
}

export interface ClassModel {
  id?: number;
  name: string;
  level: string;
  latest_student_session: StudentSession | null;
  current_academic_year_student_sessions: StudentSession[];
  subjects?: ClassSubject[];
  created_at?: string;
  updated_at?: string;
}
