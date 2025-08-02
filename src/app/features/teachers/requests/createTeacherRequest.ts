export interface CreateTeacherRequest {
  hire_date: string;
  role_id: number;
  nationality: string;
  user: {
    first_name: string;
    last_name: string;
    birthday: string;
    email: string;
    password: string;
    adress: string;
    phone: string;
    gender: string;
  };
  assignment: {
    subject_id: number;
    class_model_id: number;
    day_of_week: string;
    start_time: string;
    end_time: string;
    coefficient: number;
  };
}
