import { StudentSession } from './student-session';
import { Assignment } from './assignment';
import {Subject} from "./subject";

export interface Grade {
  id: number;
  mark: string;
  type: string;
  assignement_id: number;
  student_session_id: number;
  subject_id: number;
  subject?: Subject;
  term_id: number;
  created_at: string;
  updated_at: string;
  student_session: StudentSession;
  assignement: Assignment;
}
