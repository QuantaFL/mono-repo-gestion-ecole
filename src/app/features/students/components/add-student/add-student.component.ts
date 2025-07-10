import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.scss'
})
export class AddStudentComponent {
  studentForm!: FormGroup;
  classes = [
    { id: 1, name: '6ème A' },
    { id: 2, name: '5ème B' },
    { id: 3, name: '4ème C' }
    // À remplacer plus tard par un appel à l’API
  ];

  ngOnInit(): void {
    this.studentForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      phone: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl(''),
      enrollmentDate: new FormControl('', Validators.required),
      classId: new FormControl('', Validators.required),
      parentUserId: new FormControl(null),
      studentIdNumber: new FormControl('', Validators.required)
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      console.log('Formulaire élève :', this.studentForm.value);
      // Ici on enverra les données au backend quand ce sera prêt
    } else {
      console.log('Formulaire invalide');
    }
  }
}
