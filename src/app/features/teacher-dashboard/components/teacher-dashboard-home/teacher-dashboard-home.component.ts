import { Component, OnInit, Input } from '@angular/core';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { AcademicYear } from '../../models/academic-year';
import { ClassModel } from '../../models/class-model';
import { Term } from '../../models/term';
import { TeacherStore } from '../../services/teacher.store';
import { Teacher } from '../../models/teacher';
import { Subject } from '../../models/subject';
import {getUserFromLocalStorage} from "../../../../stores/auth-store";

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
  assignements: any[] = [];
  @Input() isSidebarCollapsed: boolean = false;

  constructor(private teacherDashboardService: TeacherDashboardService, private teacherStore: TeacherStore) { }

  ngOnInit(): void {
    this.teacherStore.currentTeacher$.subscribe(teacher => {
      this.currentTeacher = teacher;
      if (teacher) {
        this.fetchCurrentAcademicYear();
        this.fetchCurrentTerm();
        this.fetchTeacherAssignmentsAndSubjects(teacher.id);
      }
    });
  }

  /**
   * Fetches all assignments for the teacher, extracts unique subject IDs, and fetches subject details in bulk.
   * Populates uniqueSubjects and subjectIdToSubject for the dashboard.
   */
  fetchTeacherAssignmentsAndSubjects(teacherId: number): void {
    this.teacherDashboardService.getAssignmentsForTeacher(teacherId).subscribe({
      next: (assignments) => {
        this.assignements = assignments;
        this.uniqueSubjectIds = assignments.map(a => a.subject_id).filter((id: number) => !!id);
        // Remove duplicates
        this.uniqueSubjectIds = Array.from(new Set(this.uniqueSubjectIds));
        if (this.uniqueSubjectIds.length > 0) {
          this.teacherDashboardService.fetchSubjectsByIds(this.uniqueSubjectIds).subscribe({
            next: (subjects: Subject[]) => {
              this.uniqueSubjects = subjects;
              this.subjectIdToSubject = {};
              for (const subj of subjects) {
                this.subjectIdToSubject[subj.id] = subj;
              }
            },
            error: (err) => {
              this.uniqueSubjects = [];
              this.subjectIdToSubject = {};
              console.error('Error fetching subjects:', err);
            }
          });
        } else {
          this.uniqueSubjects = [];
          this.subjectIdToSubject = {};
        }
      },
      error: (err) => {
        this.assignements = [];
        this.uniqueSubjectIds = [];
        this.uniqueSubjects = [];
        this.subjectIdToSubject = {};
        console.error('Error fetching assignments:', err);
      }
    });
  }

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
