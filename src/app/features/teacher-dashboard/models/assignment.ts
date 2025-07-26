import { Subject } from './subject';
import { ClassModel } from './class-model';
import { AcademicYear } from './academic-year';
import {Term} from "./term";
import {Teacher} from "../../teachers/models/teacher";

export interface Assignment {
  id: number;
  teacher_id: number;
  class_model_id: number;
  subject_id: number;
  term_id: number;
  term?:Term;
  class_model?: ClassModel;
  teacher?:Teacher;
  created_at: string;
  updated_at: string;
  subject?: Subject;
}
