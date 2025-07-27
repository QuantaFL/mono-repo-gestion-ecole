import { Student } from "./student";
import { Term } from "./term";

export interface ReportCard {
  id: number;
  average_grade: number;
  honors: string;
  path: string;
  pdf_url: string;
  rank: number;
  created_at: string;
  updated_at: string;
  student_session_id: number;
  term_id: number;
  student?: Student;
  term?: Term;
}