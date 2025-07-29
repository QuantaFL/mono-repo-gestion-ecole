import {Component, Input, OnInit} from '@angular/core';
import {TeacherDashboardService} from '../../services/teacher-dashboard.service';
import {AcademicYear} from '../../models/academic-year';
import {Term} from '../../models/term';
import {TeacherStore} from '../../services/teacher.store';
import {Teacher} from '../../models/teacher';
import {Subject} from '../../models/subject';
import {PerformanceSummary} from '../../models/performance-summary';
import {of} from 'rxjs';
import {catchError, filter, switchMap, tap} from 'rxjs/operators';
import {Assignment} from "../../models/assignment";
  interface Terms {
  start: Date;
  end: Date;
}
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
  progressPercent: number = 0;
  daysRemaining: number = 0;
  scheduledExamsCount: number = 0;

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
        const classSubjects = this.assignements
          .filter(a => a.class_model_id && a.subject_id)
          .map(a => ({ classId: a.class_model_id, subjectId: a.subject_id }));
        if (classSubjects.length > 0) {
          return this.teacherDashboardService.getBulkPerformanceSummary(classSubjects).pipe(
            tap(summary => {
              this.performanceSummary = summary;
              console.log(summary)
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


  private calculateProgressAndDays(): void {
    if (this.currentAcademicYear) {
      const start = new Date(this.currentAcademicYear.start_date);
      const end = new Date(this.currentAcademicYear.end_date);
      const now = new Date();
      const total = end.getTime() - start.getTime();
      const elapsed = Math.max(0, Math.min(now.getTime() - start.getTime(), total));
      this.progressPercent = total > 0 ? Math.round((elapsed / total) * 100) : 0;
      this.daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    } else {
      this.progressPercent = 0;
      this.daysRemaining = 0;
    }
  }

  /**
   * Fetches the number of scheduled exams for the current academic year and term.
   * Replace with actual service call as needed.
   */
  private fetchScheduledExams(): void {
    // TODO: Replace with actual service call to fetch exams for current term/year
    // Example: this.teacherDashboardService.getScheduledExams(this.currentAcademicYear?.id, this.currentTerm?.id)
    //   .subscribe(exams => this.scheduledExamsCount = exams.length);
    this.scheduledExamsCount = 8; // Placeholder for demo
  }

  private fetchCurrentAcademicYear(): void {
    this.teacherDashboardService.getCurrentAcademicYear().pipe(
      tap(year => {
        this.currentAcademicYear = year;
        this.calculateProgressAndDays();
        this.fetchScheduledExams();
      })
    ).subscribe();
  }

  splitAcademicYear(startDateStr: string, endDateStr: string): { term1: Terms; term2: Terms } {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error("Invalid start or end date");
    }

    const totalTime = endDate.getTime() - startDate.getTime();
    const halfTime = totalTime / 2;

    const midDate = new Date(startDate.getTime() + halfTime);
    midDate.setHours(0, 0, 0, 0);

    const term1End = new Date(midDate);
    term1End.setDate(term1End.getDate() - 1);

    return {
      term1: { start: startDate, end: term1End },
      term2: { start: midDate, end: endDate }
    };
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
