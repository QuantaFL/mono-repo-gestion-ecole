import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { TeacherStore } from '../../services/teacher.store';
import { ClassModel } from '../../models/class-model';

@Component({
  selector: 'app-teacher-my-classes',
  templateUrl: './teacher-my-classes.component.html',
  styleUrls: ['./teacher-my-classes.component.scss']
})
export class TeacherMyClassesComponent implements OnInit {
  classes: ClassModel[] = [];
  loading = true;

  constructor(
    private teacherDashboardService: TeacherDashboardService,
    private teacherStore: TeacherStore,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.teacherStore.currentTeacher$.subscribe(teacher => {
      if (teacher) {
        this.teacherDashboardService.getCurrentAcademicYear().subscribe({
          next: (year) => {
            this.teacherDashboardService.getTeacherClasses(teacher.id, year.id)
              .subscribe({
                next: (classes) => {
                  this.classes = classes;
                  this.loading = false;
                  console.log('Classes fetched:', this.classes);
                },
                error: () => {
                  this.classes = [];
                  this.loading = false;
                }
              });
          },
          error: () => {
            this.loading = false;
          }
        });
      } else {
        this.loading = false;
      }
    });
  }

  async goToClassDetails(classId: number): Promise<void> {
    await this.router.navigate(['/teacher-dashboard/class-details', classId]);
  }
}
