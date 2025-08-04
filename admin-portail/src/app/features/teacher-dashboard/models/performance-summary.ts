export interface PerformanceSummary {
  bestPerformingStudent: {
    studentId: number;
    firstName: string;
    lastName: string;
    averageGrade: number;
    profilePictureUrl?: string;
  };
  worstPerformingStudent: {
    studentId: number;
    firstName: string;
    lastName: string;
    averageGrade: number;
    profilePictureUrl?: string;
  };
}
