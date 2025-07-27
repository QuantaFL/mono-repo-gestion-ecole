import { StudentSession } from './student-session';
import { Assignment } from './assignment';
import { Term } from './term';

export interface Grade {
  id?: number;
  mark: number | null;
  type: string | null;
  created_at?: string;
  updated_at?: string;
  assignement_id: number;
  student_session_id: number;
  term_id: number;
  assignement?: Assignment;
  student_session?: StudentSession;
  term?: Term;
}
