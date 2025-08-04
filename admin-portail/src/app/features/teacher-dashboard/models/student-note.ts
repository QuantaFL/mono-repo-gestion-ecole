export type StudentNote = {
  student: any; // You can replace 'any' with your Student model if needed
  student_session_id: number;
  grades: Array<{
    type: string;
    mark: number;
    status: string;
  }>;
};
