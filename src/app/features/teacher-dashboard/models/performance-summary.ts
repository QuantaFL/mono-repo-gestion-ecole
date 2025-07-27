export interface PerformanceSummary {
  bestPerformingStudent: {
    studentId: number;
    firstName: string;
    lastName: string;
    averageGrade: number;
  };
  worstPerformingStudent: {
    studentId: number;
    firstName: string;
    lastName: string;
    averageGrade: number;
  };
}