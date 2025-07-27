import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassModel } from '../models/class-model';
import { Grade } from '../models/grade';
import { AcademicYear } from '../models/academic-year';
import { Term } from '../models/term';

import { Teacher } from '../models/teacher';
import { Student } from '../models/student';

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

  getStudentByClassAndSession(classId: number, sessionId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/class-models/${classId}/students`, {
      params: {
        session_id: sessionId.toString()
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

  submitTermNotes(classId: number, termId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/grades/submit-term-notes/${classId}`, { term_id: termId });
  }

  getTerms(academicYearId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/academic-years/${academicYearId}/terms`);
  }

  getCurrentAcademicYear(): Observable<AcademicYear> {
    return this.http.get<AcademicYear>(`${this.apiUrl}/academic-year/current`);
  }

  getCurrentTerm(): Observable<Term> {
    return this.http.get<Term>(`${this.apiUrl}/terms/current`);
  }

  getTeacherProfile(): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/teacher/profile`);
  }

  getGradesForStudentInClassTerm(classId: number, termId: number, studentId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/grades/class/${classId}/term/${termId}/students/${studentId}`);
  }

  getTeacherByUserId(userId: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/teachers/users/${userId}`);
  }

  getStudentsByClassId(classId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/class-models/${classId}/students`);
  }

  getClassById(classId: number): Observable<ClassModel> {
    return this.http.get<ClassModel>(`${this.apiUrl}/class-models/${classId}`);
  }
}
