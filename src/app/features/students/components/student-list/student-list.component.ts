// @ts-ignore

import { Component, OnInit } from '@angular/core';
import { StudentService } from "../../services/student.service";
import { Router } from "@angular/router";
import { Student } from "../../models/student";

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})

export class StudentListComponent implements OnInit {
  students: Student[] = [];
  // SUPPRESSION SANS MODAL
  studentToDelete: Student | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    //private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.studentService.getAllStudents().subscribe({
      next: (res) => {
        console.log(res);
        this.students = res || [];
      },
      error: () => {
        alert('Erreur lors du chargement des étudiants.');
      }
    });
  }

  // ngOnInit() {
  //   this.studentService.getAllStudents().subscribe(data => this.students = data);
  // }
  // SUPPRESSION SANS MODAL
  deleteStudent(student: Student) {
    // if (confirm(`Voulez-vous vraiment supprimer l'étudiant ${student.firstName} ${student.lastName} ?`)) {
    //   this.studentService.deleteStudent(student.id).subscribe({
    //     next: () => {
    //       this.students = this.students.filter(s => s.id !== student.id);
    //     },
    //     error: () => {
    //       alert('Erreur lors de la suppression de l\'étudiant.');
    //     }
    //   });
    // }
  }

}
