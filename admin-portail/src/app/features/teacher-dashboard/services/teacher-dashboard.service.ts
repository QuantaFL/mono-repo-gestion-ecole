  /**
   * Fetch student notes for a specific class and subject.
   */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ClassModel} from '../models/class-model';
import {Grade} from '../models/grade';
import {AcademicYear} from '../models/academic-year';
import {Term} from '../models/term';
import {ReportCard} from '../models/report-card';

import {Teacher} from '../models/teacher';
import {Student} from '../models/student';
import { Assignment } from '../models/assignment';
import {Subject} from "../models/subject";
import {PerformanceSummary} from "../models/performance-summary";
import { StudentNote } from '../models/student-note';

@Injectable({
  providedIn: 'root'
})
export class TeacherDashboardService {

 noCacheHeaders = { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } };
  /**
   * Fetch student notes for a specific class and subject.
   */
  getStudentNotesForSubject(classId: number, subjectId: number): Observable<StudentNote[]> {
    return this.http.get<StudentNote[]>(`${this.apiUrl}/classes/${classId}/subjects/${subjectId}/student-notes`, this.noCacheHeaders);
  }
  /**
   * Fetch all grades for all students in the class, optionally filtered by teacher, subject, or assignment.
   * If a parameter is not provided, 'null' is used in the URL.
   */
  getAllGradesForClass(
    classId: number,
    teacherId?: number,
    subjectId?: number,
    assignmentId?: number
  ) {
    const teacherPart = teacherId !== undefined && teacherId !== null ? teacherId : 'null';
    const subjectPart = subjectId !== undefined && subjectId !== null ? subjectId : 'null';
    const assignmentPart = assignmentId !== undefined && assignmentId !== null ? assignmentId : 'null';
    // students is always 'null' for this endpoint (fetch all students)
    const url = `${this.apiUrl}/grades/class/${classId}/students/null/teacher/${teacherPart}/subject/null/assignement/${assignmentPart}`;
    return this.http.get<Grade[]>(url);
  }
  addGradesBatch(grades: any[]) {
    return this.http.post(`${this.apiUrl}/grades`, { grades });
  }
  private apiUrl = 'http://localhost:8000/api/v1'; // Assuming your API runs on localhost:8000

  constructor(private http: HttpClient) { }

  getTeacherClasses(teacherId: number, academicYearId: number): Observable<ClassModel[]> {
    console.log(`Fetching classes for teacher ID: ${teacherId}, Academic Year ID: ${academicYearId}`);
    return this.http.get<ClassModel[]>(`${this.apiUrl}/teachers/${teacherId}/classes`, {
      params: {
        academic_year_id: academicYearId.toString()
      },
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
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
      },
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
    });
  }

  updateGrades(grades: {
    grades: Grade[]
  }): Observable<Grade[]> {
    return this.http.post<Grade[]>(`${this.apiUrl}/grades`, { grades });
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
    return this.http.get<Grade[]>(`${this.apiUrl}/grades/class/${classId}/students/${studentId}`, this.noCacheHeaders);
  }

  getTeacherByUserId(userId: number): Observable<Teacher> {
    return this.http.get<Teacher>(`${this.apiUrl}/teachers/users/${userId}`);
  }

  getStudentsByClassId(classId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/classes/${classId}/students`, this.noCacheHeaders);
  }

  getClassById(classId: number): Observable<ClassModel> {
    return this.http.get<ClassModel>(`${this.apiUrl}/classes/${classId}`);
  }

  /**
   * Fetch multiple students by an array of IDs
   */
  fetchStudentsByIds(studentIds: number[]): Observable<Student[]> {
    return this.http.post<Student[]>(`${this.apiUrl}/students/bulk`, { ids: studentIds });
  }

  getAssignmentsForTeacher(id: number): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/assignments/teacher/${id}`);
  }
  fetchSubjectsByIds(ids: number[]): Observable<Subject[]> {
    return this.http.post<Subject[]>(`${this.apiUrl}/subjects/bulk`, { ids }, this.noCacheHeaders);
  }

  /**
   * Update a single grade by ID.
   * @param id Grade ID
   * @param payload Grade update payload
   */
  updateGrade(id: number, payload: any): Observable<Grade> {
    return this.http.put<Grade>(`${this.apiUrl}/grades/${id}`, payload);
  }

  getTeacherClassAssignmentsNotes(teacherId: number, classId: number, subjectId: number, assignmentId: number): Observable<StudentNote[]> {
    return this.http.get<StudentNote[]>(`http://localhost:8000/api/v1/classes/${classId}/subjects/${subjectId}/assignments/${assignmentId}/teachers/${teacherId}/student-notes`);
  }

  /**
   * Add a new grade.
   * @param payload Grade creation payload
   */
  addGrade(payload: any): Observable<Grade> {
    return this.http.post<Grade>(`${this.apiUrl}/grades`, payload);
  }



  /**
   * Get best and worst performing students across multiple classes and subjects.
   * @param classSubjects Array of { classId, subjectId }
   */
  getBulkPerformanceSummary(classSubjects: { classId: number, subjectId: number }[]): Observable<PerformanceSummary> {
    return this.http.post<PerformanceSummary>(`${this.apiUrl}/teachers/dashboard/performance-summary/bulk`, { classSubjects }, this.noCacheHeaders);
  }

  getReportCardsForStudent(studentId: number): Observable<ReportCard[]> {
    return this.http.get<ReportCard[]>(`${this.apiUrl}/students/${studentId}/report-cards`, this.noCacheHeaders);
  }
}
