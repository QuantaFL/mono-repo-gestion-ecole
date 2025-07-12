import { Injectable } from '@angular/core';
import {Student} from "../models/student";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private students: Student[] = [
    {
      id: 1,
      userId: 10,
      user: {
        id: 10,
        firstName: 'Fatou',
        lastName: 'Diop',
        adresse: 'Dakar',
        dateOfBirth: '2009-01-01',
        email: 'fatou@example.com',
        phone: '77 123 45 67',
        password: 'mock',
        roleId: 1
      },
      parentUserId: 1,
      parentUser: {
        id: 1,
        firstName: 'Mamadou',
        lastName: 'Diop',
        adresse: 'Dakar',
        dateOfBirth: '1979-02-02',
        email: 'mamadou@example.com',
        phone: '77 654 32 10',
        password: 'mock',
        roleId: 2
      },
      enrollmentDate: '',
      classId: 1,
      classModel: {
        id: 1,
        name: '6e A',
        academicYear: '2023-2024',
      },
      studentIdNumber: 'S001',
      matricule: 'MAT001'
    }

  ];


  constructor() {}

  getAllStudents(): Observable<Student[]> {
    return of(this.students);
  }
}
