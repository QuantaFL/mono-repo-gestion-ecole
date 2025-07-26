import { Component, OnInit } from '@angular/core';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { AcademicYear } from '../../models/academic-year';
import { ClassModel } from '../../models/class-model';

@Component({
  selector: 'app-teacher-dashboard-home',
  templateUrl: './teacher-dashboard-home.component.html',
  styleUrl: './teacher-dashboard-home.component.scss'
})
export class TeacherDashboardHomeComponent implements OnInit {
  academicYears: AcademicYear[] = [];
  selectedAcademicYear: AcademicYear | null = null;
  teacherClasses: ClassModel[] = [];

  // Placeholder for the current teacher's ID. In a real application, this would come from authentication.
  currentTeacherId: number = 1;

  constructor(private teacherDashboardService: TeacherDashboardService) { }

  ngOnInit(): void {
    this.fetchAcademicYears();
  }

  fetchAcademicYears(): void {
    this.teacherDashboardService.getAcademicYears().subscribe({
      next: (years: AcademicYear[]) => {
        this.academicYears = years;
       this.selectedAcademicYear = years.find((year: AcademicYear) => year.status === 'active') || years[0];
        if (this.selectedAcademicYear) {
          this.fetchTeacherClasses(this.selectedAcademicYear.id);
        }
      },
      error: (err: any) => {
        console.error('Error fetching academic years:', err);
      }
    });
  }

  onAcademicYearChange(): void {
    if (this.selectedAcademicYear) {
      this.fetchTeacherClasses(this.selectedAcademicYear.id);
    }
  }

  fetchTeacherClasses(academicYearId: number): void {
    console.log(academicYearId)
    this.teacherDashboardService.getTeacherClasses(this.currentTeacherId, academicYearId).subscribe({
      next: (classes) => {
        this.teacherClasses = classes;
        console.log(classes)
      },
      error: (err) => {
        console.error('Error fetching teacher classes:', err);
      }
    });
  }
}
