import { Injectable } from '@angular/core';
import {Student} from "../models/student";
import {Observable} from "rxjs";
import { HttpClient } from '@angular/common/http';
import {CreateStudentRequest} from "../requests/createStudentRequest";
import {UpdateStudentRequest} from "../requests/updateStudentRequest";
import { CreateStudentResponse } from "../requests/createStudentResponse";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8000/api/v1/students';

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: any): Observable<any> {
    // Si c'est un FormData (upload fichier), laisse Angular gérer le content-type
    return this.http.post<any>(`${this.apiUrl}/inscription`, student);
  }

  updateStudent(id: number, student: UpdateStudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }
}
