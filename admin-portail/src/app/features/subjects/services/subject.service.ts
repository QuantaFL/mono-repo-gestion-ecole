import { Injectable } from '@angular/core';
import {CreateStudentRequest} from "../../students/requests/createStudentRequest";
import {HttpClient} from "@angular/common/http";
import {CreateSubjectRequest} from "../requests/createSubjectRequest";
import {Observable} from "rxjs";
import {Student} from "../../students/models/student";
import {Subject} from "../models/subject";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = 'http://localhost:8000/api/v1/subjects'; // adapte l'URL si besoin

  constructor(private http: HttpClient) {}

  createSubject(student: CreateSubjectRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, student);
  }


  getAllSubject(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}`);
  }

  toggleSubjectStatus(name: string): Observable<Subject> {
    return this.http.post<Subject>(`${this.apiUrl}/toggle-status`, { name });
  }
}
