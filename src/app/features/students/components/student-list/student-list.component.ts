<<<<<<< Updated upstream
import { Component } from '@angular/core';
import {StudentService} from "../../services/student.service";
import {Router} from "@angular/router";
import {Student} from "../../models/student";
import {Observable} from "rxjs";
=======
import { Component, OnInit } from '@angular/core';
import { StudentService } from "../../services/student.service";
import { Router } from "@angular/router";
import { Student } from "../../models/student";

declare var window: any;
>>>>>>> Stashed changes

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
<<<<<<< Updated upstream
export class StudentListComponent {
constructor(private studentService: StudentService,router:Router) {
}
students:Student[] = [];
ngOnInit() {
  this.studentService.getAllStudents().subscribe(data=>this.students=data);
}
=======
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  studentToDelete: Student | null = null;
  deleteModal: any;

  constructor(
    private studentService: StudentService,
    private router: Router,
    //private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.studentService.getAllStudents().subscribe(data => this.students = data);
    this.deleteModal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    );
  }

  openDeleteModal(student: Student) {
    this.studentToDelete = student;
    this.deleteModal.show();
  }

  confirmDelete() {
    if (this.studentToDelete) {
      // Logique de suppression ici, par exemple appeler un service
      console.log('Suppression de l\'étudiant:', this.studentToDelete);
      //this.notificationService.showSuccess('Élève supprimé avec succès !');
      this.deleteModal.hide();
    }
  }
>>>>>>> Stashed changes
}
