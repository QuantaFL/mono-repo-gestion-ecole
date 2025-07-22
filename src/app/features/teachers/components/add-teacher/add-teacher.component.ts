import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {TeacherService} from "../../services/teacher.service";

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrl: './add-teacher.component.scss'
})
export class AddTeacherComponent {
  teacherForm = new FormGroup({
    lastName: new FormControl(''),
    firstName: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    hireDate: new FormControl(''),
  });

  constructor(private router: Router,private teacherService:TeacherService) {}

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const formValue = this.teacherForm.value;
      const teacherData = {
        first_name: formValue.firstName ?? '',
        last_name: formValue.lastName ?? '',
        email: formValue.email ?? '',
        phone: formValue.phone ?? '',
        hire_date: formValue.hireDate ?? '',
        role_id: 2 // Set the appropriate role_id value
      };
      this.teacherService.createTeacher(teacherData).subscribe({
        next: (res) => {
          console.log('Teacher created:', res);
          this.router.navigate(['/teachers/list']);
        },
        error: (err) => {
          console.error('Error creating teacher:', err);
        }
      });
    }
  }
}
