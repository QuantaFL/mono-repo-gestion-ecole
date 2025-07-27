import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Assignment } from '../models/assignment';
import { Subject } from '../models/subject';
import { Student } from '../models/student';
import { Grade } from '../models/grade';
import { PerformanceSummary } from '../models/performance-summary';

interface TeacherDashboardState {
  assignments: Assignment[];
  uniqueSubjects: Subject[];
  subjectIdToSubject: { [id: number]: Subject };
  students: Student[];
  grades: Grade[];
  performanceSummary: PerformanceSummary | null;
}

const initialState: TeacherDashboardState = {
  assignments: [],
  uniqueSubjects: [],
  subjectIdToSubject: {},
  students: [],
  grades: [],
  performanceSummary: null,
};

@Injectable({
  providedIn: 'root',
})
export class TeacherDashboardDataStore {
  private readonly _state = new BehaviorSubject<TeacherDashboardState>(initialState);

  readonly state$: Observable<TeacherDashboardState> = this._state.asObservable();

  readonly assignments$: Observable<Assignment[]> = this.state$.pipe(
    map(state => state.assignments)
  );

  readonly uniqueSubjects$: Observable<Subject[]> = this.state$.pipe(
    map(state => state.uniqueSubjects)
  );

  readonly subjectIdToSubject$: Observable<{ [id: number]: Subject }> = this.state$.pipe(
    map(state => state.subjectIdToSubject)
  );

  readonly students$: Observable<Student[]> = this.state$.pipe(
    map(state => state.students)
  );

  readonly grades$: Observable<Grade[]> = this.state$.pipe(
    map(state => state.grades)
  );

  readonly performanceSummary$: Observable<PerformanceSummary | null> = this.state$.pipe(
    map(state => state.performanceSummary)
  );

  constructor() {}

  private get currentState(): TeacherDashboardState {
    return this._state.getValue();
  }

  setAssignments(assignments: Assignment[]): void {
    this._state.next({
      ...this.currentState,
      assignments,
    });
  }

  setUniqueSubjects(uniqueSubjects: Subject[], subjectIdToSubject: { [id: number]: Subject }): void {
    this._state.next({
      ...this.currentState,
      uniqueSubjects,
      subjectIdToSubject,
    });
  }

  setStudents(students: Student[]): void {
    this._state.next({
      ...this.currentState,
      students,
    });
  }

  setGrades(grades: Grade[]): void {
    this._state.next({
      ...this.currentState,
      grades,
    });
  }

  setPerformanceSummary(summary: PerformanceSummary | null): void {
    this._state.next({
      ...this.currentState,
      performanceSummary: summary,
    });
  }

  resetState(): void {
    this._state.next(initialState);
  }
}
