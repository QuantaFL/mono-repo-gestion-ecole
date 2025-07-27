import { Student } from "../models/student";
import {StudentSession} from "../../teacher-dashboard/models/student-session";


export interface CreateStudentResponse {
  student: Student;
  student_session: StudentSession;
  academic_records_url: string;
}
