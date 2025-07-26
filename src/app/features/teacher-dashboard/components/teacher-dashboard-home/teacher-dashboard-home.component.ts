import { Component, OnInit } from '@angular/core';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { AcademicYear } from '../../models/academic-year';
import { ClassModel } from '../../models/class-model';
import { Term } from '../../models/term';
import { TeacherStore } from '../../services/teacher.store';
import { Teacher } from '../../models/teacher';
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

  constructor(private teacherDashboardService: TeacherDashboardService, private teacherStore: TeacherStore) { }

  ngOnInit(): void {
    this.teacherStore.currentTeacher$.subscribe(teacher => {
      this.currentTeacher = teacher;
      if (teacher) {
        this.fetchCurrentAcademicYear();
        this.fetchCurrentTerm();
        this.fetchTeacherProfile();
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
      },
      error: (err: any) => {
        console.error('Error fetching teacher profile:', err);
      }
    });
  }

  get academicYearLabel(): string {
    return this.currentAcademicYear?.label || 'N/A';
  }

  get termName(): string {
    return this.currentTerm?.name || 'N/A';
  }

  get assignedSubjectsNames(): string {
    return this.currentTeacher?.subjects?.map(s => s.name).join(', ') || 'N/A';
  }
}
