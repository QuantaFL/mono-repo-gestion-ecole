import { ClassModel } from './class-model';
import { AcademicYear } from './academic-year';
import { Student } from './student';

export interface StudentSession {
  id: number;
  student_id: number;
  academic_year_id: number;
  class_model_id: number;
  created_at: string;
  updated_at: string;
  class_model: ClassModel;
  student: Student;
}
