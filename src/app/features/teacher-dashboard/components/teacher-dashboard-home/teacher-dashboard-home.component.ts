import { Component, OnInit, Input } from '@angular/core';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { AcademicYear } from '../../models/academic-year';
import { ClassModel } from '../../models/class-model';
import { Term } from '../../models/term';
import { TeacherStore } from '../../services/teacher.store';
import { Teacher } from '../../models/teacher';
import { Subject } from '../../models/subject';
import { PerformanceSummary } from '../../models/performance-summary';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError, filter, tap } from 'rxjs/operators';
import { Student } from '../../models/student';
import { Grade } from '../../models/grade';
import {Assignment} from "../../models/assignment";

@Component({
  selector: 'app-teacher-dashboard-home',
  templateUrl: './teacher-dashboard-home.component.html',
  styleUrl: './teacher-dashboard-home.component.scss'
})
export class TeacherDashboardHomeComponent implements OnInit {
  currentAcademicYear: AcademicYear | null = null;
  currentTerm: Term | null = null;
  currentTeacher: Teacher | null = null;
  uniqueSubjects: Subject[] = [];
  subjectIdToSubject: { [id: number]: Subject } = {};
  uniqueSubjectIds: number[] = [];
  assignements: Assignment[] = [];
  @Input() isSidebarCollapsed: boolean = false;
  performanceSummary: PerformanceSummary | null = null;

  constructor(private teacherDashboardService: TeacherDashboardService, private teacherStore: TeacherStore) { }

  ngOnInit(): void {
    this.teacherStore.currentTeacher$.pipe(
      filter(teacher => !!teacher),
      tap(teacher => {
        this.currentTeacher = teacher;
        this.fetchCurrentAcademicYear();
        this.fetchCurrentTerm();
      }),
      switchMap(teacher => this.teacherDashboardService.getAssignmentsForTeacher(teacher!.id)),
      tap(assignments => {
        this.assignements = assignments;
        this.uniqueSubjectIds = Array.from(new Set(assignments.map(a => a.subject_id).filter((id: number) => !!id)));
      }),
      switchMap(() => {
        if (this.uniqueSubjectIds.length > 0) {
          return this.teacherDashboardService.fetchSubjectsByIds(this.uniqueSubjectIds).pipe(
            tap(subjects => {
              this.uniqueSubjects = subjects;
              this.subjectIdToSubject = {};
              for (const subj of subjects) {
                this.subjectIdToSubject[subj.id] = subj;
              }
            }),
            catchError(err => {
              console.error('Error fetching subjects:', err);
              this.uniqueSubjects = [];
              this.subjectIdToSubject = {};
              return of([]);
            })
          );
        } else {
          this.uniqueSubjects = [];
          this.subjectIdToSubject = {};
          return of([]);
        }
      }),
      switchMap(() => {
        // Build classSubjects array for bulk performance summary
        const classSubjects = this.assignements
          .filter(a => a.class_model_id && a.subject_id)
          .map(a => ({ classId: a.class_model_id, subjectId: a.subject_id }));
        if (classSubjects.length > 0) {
          return this.teacherDashboardService.getBulkPerformanceSummary(classSubjects).pipe(
            tap(summary => {
              this.performanceSummary = summary;
            }),
            catchError(err => {
              this.performanceSummary = null;
              console.error('Error fetching bulk performance summary:', err);
              return of(null);
            })
          );
        } else {
          this.performanceSummary = null;
          return of(null);
        }
      }),
      catchError(err => {
        console.error('Error in dashboard data flow:', err);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * This method is no longer needed as the logic has been moved to ngOnInit using RxJS operators.
   */
  // fetchTeacherAssignmentsAndSubjects(teacherId: number): void {
  //   // Old logic removed
  // }

  fetchCurrentAcademicYear(): void {
    this.teacherDashboardService.getCurrentAcademicYear().subscribe({
      next: (year: AcademicYear) => {
        this.currentAcademicYear = year;
      },
      error: (err: any) => {
        console.error('Error fetching current academic year:', err);
      }
    });
  }

  fetchCurrentTerm(): void {
    this.teacherDashboardService.getCurrentTerm().subscribe({
      next: (term: Term) => {
        this.currentTerm = term;
      },
      error: (err: any) => {
        console.error('Error fetching current term:', err);
      }
    });
  }

  fetchTeacherProfile(): void {
    this.teacherDashboardService.getTeacherProfile().subscribe({
      next: (teacher: Teacher) => {
        this.currentTeacher = teacher;
        this.teacherStore.setTeacher(teacher); // Update the store with the full profile
        this.setUniqueSubjectsFromTeacher(teacher); // Ensure uniqueSubjects is updated after profile fetch
      },
      error: (err: any) => {
        console.error('Error fetching teacher profile:', err);
      }
    });
  }

  /**
   * Sets uniqueSubjects from the teacher's subjects, deduplicated by subject id.
   * @param teacher The current teacher object
   */
  setUniqueSubjectsFromTeacher(teacher: Teacher): void {
    if (teacher && Array.isArray(teacher.subjects)) {
      const seen = new Set<number>();
      this.uniqueSubjects = teacher.subjects.filter(subj => {
        if (subj && !seen.has(subj.id)) {
          seen.add(subj.id);
          return true;
        }
        return false;
      });
    } else {
      this.uniqueSubjects = [];
    }
  }

  get academicYearLabel(): string {
    return this.currentAcademicYear?.label || 'N/A';
  }

  get termName(): string {
    return this.currentTerm?.name || 'N/A';
  }

  get assignedSubjectsNames(): string {
    // Deprecated: use uniqueSubjects in template instead
    return this.currentTeacher?.subjects?.map(s => s.name).join(', ') || 'N/A';
  }

  /**
   * Returns a comma-separated string of unique subject names for the teacher.
   */
  getUniqueSubjectNames(): string {
    return (this.uniqueSubjects && this.uniqueSubjects.length)
      ? this.uniqueSubjects.map(subject => subject?.name).filter(Boolean).join(', ')
      : '';
  }
}
