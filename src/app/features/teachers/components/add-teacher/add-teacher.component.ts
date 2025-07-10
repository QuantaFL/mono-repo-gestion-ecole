import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";

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

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.teacherForm.valid) {
      console.log('Form submitted:', this.teacherForm.value);
      // TODO: appeler le service ici une fois qu'il sera prêt
      this.router.navigate(['/teachers/list']);
    }
  }
}
