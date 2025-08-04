export interface Document {
  id: number;
  studentId: number;
  documentType: string;
  filePath: string;
  uploadedAt: string;
  createdAt?: string;
  updatedAt?: string;
}
