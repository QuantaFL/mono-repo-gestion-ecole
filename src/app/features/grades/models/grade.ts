export interface Grade {
  id: number;
  studentId: number;
  subjectId: number;
  teacherId: number;
  classId: number;
  gradeValue: number;
  period: string;
  academicYear: string;
  dateRecorded: string;
  createdAt?: string;
  updatedAt?: string;
}
