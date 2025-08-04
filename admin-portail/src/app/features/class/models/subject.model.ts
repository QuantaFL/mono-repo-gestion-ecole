export interface Subject {
  id: number;
  name: string;
  level: string;
  coefficient: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AssignSubjectRequest {
  class_id: number;
  subject_id: number;
}

export interface AssignSubjectResponse {
  id: number;
  name: string;
  level: string;
  created_at: string;
  updated_at: string;
  subjects: Subject[];
}