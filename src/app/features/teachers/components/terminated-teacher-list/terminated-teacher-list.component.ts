import { Component, OnInit } from '@angular/core';
import { Teacher } from '../../models/teacher';
import { TeacherService } from '../../services/teacher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminated-teacher-list',
  templateUrl: './terminated-teacher-list.component.html',
  styleUrls: ['./terminated-teacher-list.component.scss']
})
export class TerminatedTeacherListComponent implements OnInit {
  terminatedTeachers: Teacher[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private teacherService: TeacherService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.fetchTerminatedTeachers();
  }
  gotoTeacherList() {
      this.router.navigateByUrl('/list_teacher'); // Navigate to the teacher list
  }

  fetchTerminatedTeachers(): void {
    this.loading = true;
    this.teacherService.getAllTeacher().subscribe({
      next: (res) => {
        console.log('All teachers:', res);
        // Filtrer pour n'afficher que les enseignants avec contrats résiliés
        this.terminatedTeachers = res.filter(teacher => teacher.isActive === false);
        this.loading = false;
        console.log('Terminated teachers:', this.terminatedTeachers);
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des enseignants résiliés';
        this.loading = false;
      }
    });
  }
}