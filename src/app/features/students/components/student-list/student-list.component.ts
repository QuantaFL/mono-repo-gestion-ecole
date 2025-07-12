import { Component } from '@angular/core';
import {StudentService} from "../../services/student.service";
import {Router} from "@angular/router";
import {Student} from "../../models/student";
import {Observable} from "rxjs";

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss'
})
export class StudentListComponent {
constructor(private studentService: StudentService,router:Router) {
}
students:Student[] = [];
ngOnInit() {
  this.studentService.getAllStudents().subscribe(data=>this.students=data);
}
}
