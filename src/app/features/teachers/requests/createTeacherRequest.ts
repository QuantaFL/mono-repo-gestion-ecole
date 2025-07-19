export interface CreateTeacherRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  hire_date: string;
  role_id: number;
}
