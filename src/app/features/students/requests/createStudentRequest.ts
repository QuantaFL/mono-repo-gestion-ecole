export interface CreateStudentRequest {
  // Parent fields
  parent_first_name: string;
  parent_last_name: string;
  parent_email: string;
  parent_password: string;
  parent_phone: string;
  parent_adress: string;
  parent_birthday: string;
  parent_gender: string;
  parent_role_id: number;

  // Student fields
  student_first_name: string;
  student_last_name: string;
  student_email: string;
  student_password: string;
  student_phone: string;
  student_adress: string;
  student_matricule: string;
  student_birthday: string;
  student_gender: string;
  student_role_id: number;

  // Academic info
  class_model_id: number;
  academic_year_id: number;
  academic_records?: string;
}
