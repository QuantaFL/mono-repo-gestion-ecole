import {StudentSession} from "./student-session";

export interface ClassModel {
  id: number;
  name: string;
  level: string;
  latest_student_session:StudentSession[];
}
