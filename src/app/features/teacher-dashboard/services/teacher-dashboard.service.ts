import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassModel } from '../models/class-model';
import { Grade } from '../models/grade';

@Injectable({
  providedIn: 'root'
})
export class TeacherDashboardService {
  private apiUrl = 'http://localhost:8000/api/v1'; // Assuming your API runs on localhost:8000

  constructor(private http: HttpClient) { }

  getTeacherClasses(teacherId: number, academicYearId: number): Observable<ClassModel[]> {
    console.log(`Fetching classes for teacher ID: ${teacherId}, Academic Year ID: ${academicYearId}`);
    return this.http.get<ClassModel[]>(`${this.apiUrl}/teachers/${teacherId}/classes`, {
      params: {
        academic_year_id: academicYearId.toString()
      }
    });
  }

  getGrades(termId: number, classModelId: number, subjectId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades`, {
      params: {
        term_id: termId.toString(),
        class_model_id: classModelId.toString(),
        subject_id: subjectId.toString()
      }
    });
  }

  updateGrades(grades: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/grades`, { grades });
  }

  closeTerm(termId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/terms/${termId}/close`, {});
  }

  getTerms(academicYearId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic-years/${academicYearId}/terms`);
  }

  getAcademicYears(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic-years`);
  }
}
