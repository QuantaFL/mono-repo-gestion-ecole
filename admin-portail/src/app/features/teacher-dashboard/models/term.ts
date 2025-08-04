import { AcademicYear } from "./academic-year";

export interface Term {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  academic_year_id: number;
  academic_year?: AcademicYear;
}
