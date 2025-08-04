import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject, AssignSubjectRequest, AssignSubjectResponse } from '../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private apiUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) {}

  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.apiUrl}/subjects`);
  }

  assignSubjectToClass(request: AssignSubjectRequest): Observable<AssignSubjectResponse> {
    return this.http.post<AssignSubjectResponse>(`${this.apiUrl}/classes/assign-subject`, request);
  }
}