import { Subject } from './subject';
import { ClassModel } from './class-model';
import { Term } from "./term";
import { Teacher } from "./teacher";

export interface Assignment {
  id: number;
  created_at: string;
  updated_at: string;
  teacher_id: number;
  class_model_id: number;
  subject_id: number;
  term_id: number;
  teacher?: Teacher;
  classModel?: ClassModel;
  subject?: Subject;
  term?: Term;
}
