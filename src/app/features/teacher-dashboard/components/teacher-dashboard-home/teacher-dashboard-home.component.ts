import { Component, OnInit } from '@angular/core';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { AcademicYear } from '../../models/academic-year';
import { ClassModel } from '../../models/class-model';
import { TeacherStore } from '../../services/teacher.store';
import {Teacher} from "../../../teachers/models/teacher";
import {getUserFromLocalStorage} from "../../../../stores/auth-store";

@Component({
  selector: 'app-teacher-dashboard-home',
  templateUrl: './teacher-dashboard-home.component.html',
  styleUrl: './teacher-dashboard-home.component.scss'
})
export class TeacherDashboardHomeComponent implements OnInit {
  academicYears: AcademicYear[] = [];
  selectedAcademicYear: AcademicYear | null = null;
  teacherClasses: ClassModel[] = [];
  currentTeacher: Teacher | null = null; // To store the fetched teacher data

  constructor(private teacherDashboardService: TeacherDashboardService, private teacherStore: TeacherStore) { }

  ngOnInit(): void {
    this.teacherStore.currentTeacher$.subscribe(teacher => {
      this.currentTeacher = teacher;
      if (teacher) {
        console.log('Teacher from store:', teacher);
        this.fetchAcademicYears();
      } else {
        // If teacher is null from store, try to fetch from API using user from local storage
        const user = getUserFromLocalStorage();
        if (user && user.id) {
          this.teacherDashboardService.getTeacherByUserId(user.id).subscribe({
            next: (fetchedTeacher) => {
              this.teacherStore.setTeacher(fetchedTeacher);
              console.log('Fetched Teacher from API:', fetchedTeacher);
            },
            error: (err) => {
              console.error('Error fetching teacher data:', err);
            }
          });
        } else {
          console.warn('User not found in local storage or user ID is missing. Cannot fetch teacher data.');
        }
      }
    });
  }

  // Removed loadTeacherData() as its logic is now integrated into ngOnInit

  fetchAcademicYears(): void {
    if (!this.currentTeacher) {
      console.warn('Cannot fetch academic years: current teacher is not available.');
      return;
    }
    this.teacherDashboardService.getAcademicYears().subscribe({
      next: (years: AcademicYear[]) => {
        this.academicYears = years;
        this.selectedAcademicYear = years.find((year: AcademicYear) => year.status === 'active') || years[0];
        if (this.selectedAcademicYear && this.currentTeacher) {
          this.fetchTeacherClasses(this.selectedAcademicYear.id);
        }
      },
      error: (err: any) => {
        console.error('Error fetching academic years:', err);
      }
    });
  }

  onAcademicYearChange(): void {
    if (this.selectedAcademicYear && this.currentTeacher) {
      this.fetchTeacherClasses(this.selectedAcademicYear.id);
    }
  }

  fetchTeacherClasses(academicYearId: number): void {
    console.log(academicYearId);
    if (this.currentTeacher && this.currentTeacher.userModel && this.currentTeacher.userModel.id) {
      this.teacherDashboardService.getTeacherClasses(this.currentTeacher.id, academicYearId).subscribe({
        next: (classes) => {
          this.teacherClasses = classes;
          console.log(classes);
        },
        error: (err) => {
          console.error('Error fetching teacher classes:', err);
        }
      });
    } else {
      console.warn('Current teacher data not available to fetch classes.');
    }
  }
}
