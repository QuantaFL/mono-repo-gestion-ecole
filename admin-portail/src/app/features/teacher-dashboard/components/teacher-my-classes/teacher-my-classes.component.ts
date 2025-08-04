
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { TeacherStore } from '../../services/teacher.store';
import { ClassModel } from '../../models/class-model';
interface ClassesCache {
  key: string;
  classes: ClassModel[];
}
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
            const cacheKey = `teacher_classes_${teacher.id}_${year.id}`;
            const maxAge = 5 * 60 * 1000; // 5 minutes
            const cached = this.getCache<ClassModel[]>(cacheKey, maxAge);
            if (cached) {
              this.classes = cached;
              this.loading = false;
              console.log('Classes loaded from cache:', this.classes);
              return;
            }
            this.teacherDashboardService.getTeacherClasses(teacher.id, year.id)
              .subscribe({
                next: (classes) => {
                  this.classes = classes;
                  this.setCache(cacheKey, classes);
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
  // Utility cache interface for classes

  /**
   * Utility for localStorage caching with expiry
   */
  private getCache<T>(key: string, maxAgeMs: number): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.ts < maxAgeMs) {
        return parsed.data as T;
      }
    } catch {}
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  }
}
