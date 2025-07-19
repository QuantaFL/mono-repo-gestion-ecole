export interface CreateStudentRequest {
  enrollment_date: string;
  class_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role_id: number;
  address?: string;
  date_of_birth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  parent_user_id?: number;
  tutor_phone_number: string;
}
