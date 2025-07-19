import { Injectable } from '@angular/core';
import {Student} from "../models/student";
import {Observable} from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8000/api/etudiants'; // adapte l'URL si besoin

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<{ success: boolean; students: Student[] }> {
    return this.http.get<{ success: boolean; students: Student[] }>(`${this.apiUrl}`);
  }

  getStudentById(id: number): Observable<{ success: boolean; student: Student }> {
    return this.http.get<{ success: boolean; student: Student }>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, student);
  }

  updateStudent(id: number, student: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
