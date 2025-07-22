import {Component, OnInit} from '@angular/core';
import {Teacher} from "../../models/teacher";
import {TeacherService} from "../../services/teacher.service";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  loading = false;
  error: string | null = null;

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.fetchTeachers();
  }

  fetchTeachers(): void {
    this.loading = true;
    this.teacherService.getAllTeacher().subscribe({
      next: (res) => {
        console.log(res);
        this.teachers = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des enseignants';
        this.loading = false;
      }
    });
  }
}
