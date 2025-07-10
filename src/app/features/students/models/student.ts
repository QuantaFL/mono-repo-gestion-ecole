export interface Student {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
  enrollmentDate: string;
  classId: number;
  parentUserId?: number;
  studentIdNumber: string;
  createdAt?: string;
  updatedAt?: string;
}
