import { Student } from "../models/student";
import { StudentSession } from "../models/studentSession";

export interface CreateStudentResponse {
  student: Student;
  student_session: StudentSession;
  academic_records_url: string;
}
