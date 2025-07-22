import { Injectable } from '@angular/core';
import {Student} from "../models/student";
import {Observable} from "rxjs";
import { HttpClient } from '@angular/common/http';
import {CreateStudentRequest} from "../requests/createStudentRequest";
import {UpdateStudentRequest} from "../requests/updateStudentRequest";

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8000/api/v1/etudiants';

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}`);
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  createStudent(student: CreateStudentRequest): void {
    try{
      this.http.post(`${this.apiUrl}`, student);
      console.log("Student created successfully");
    }catch (e){
      throw e
    }
  }

  updateStudent(id: number, student: UpdateStudentRequest): void {
    try{
      this.http.put<any>(`${this.apiUrl}/${id}`, student);
    }catch (e){
      throw e;
    }
  }
}
