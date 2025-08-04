export interface UpdateTeacherRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
}
