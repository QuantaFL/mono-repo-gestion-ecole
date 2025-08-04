export interface ReportCard {
  id: number;
  studentId: number;
  academicYear: string;
  period: string;
  averageGradeGeneral?: number;
  mention?: string;
  rank?: number;
  appreciation?: string;
  pdfPath: string;
  generatedAt: string;
  createdAt?: string;
  updatedAt?: string;
}
