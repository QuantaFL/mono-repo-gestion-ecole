import { Component, OnInit } from '@angular/core';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { Teacher } from '../../models/teacher';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './teacher-profile.component.html',
  styleUrls: ['./teacher-profile.component.scss']
})
export class TeacherProfileComponent implements OnInit {
  teacher: Teacher | null = null;

  constructor(private teacherDashboardService: TeacherDashboardService) { }

  ngOnInit(): void {
    this.teacherDashboardService.getTeacherProfile().subscribe({
      next: (data) => {
        this.teacher = data;
      },
      error: (err) => {
        console.error('Error fetching teacher profile:', err);
      }
    });
  }

  get assignedSubjectsNames(): string {
    return this.teacher?.subjects?.map(s => s.name).join(', ') || 'N/A';
  }
}