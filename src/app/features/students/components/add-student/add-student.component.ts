import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ClassService } from '../../../class/services/class.service';
import { ClassModel } from '../../../class/models/class';
import { StudentService } from '../../services/student.service';
import { Router } from '@angular/router';
import {CreateStudentRequest} from "../../requests/createStudentRequest";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  studentForm!: FormGroup;
  currentStep: number = 1;

  classes: ClassModel[] = [];

  constructor(private classService: ClassService, private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.studentForm = new FormGroup({
      // Étape 1 — infos de l'élève
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),

      // Étape 2 — coordonnées
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(7[05678])[0-9]{7}$/) // format Sénégal
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      address: new FormControl(''),

      // Étape 3 — infos scolaires
      enrollmentDate: new FormControl('', Validators.required),
      classId: new FormControl('', Validators.required),
      studentIdNumber: new FormControl('', Validators.required),
      matricule: new FormControl('', Validators.required),

      // Étape 4 — parent (optionnel)
      parentUserId: new FormControl(null, Validators.min(1)),
      parentFirstName: new FormControl(''),
      parentLastName: new FormControl(''),
      parentPhone: new FormControl(''),
      parentEmail: new FormControl(''),
      parentAddress: new FormControl('')
    });
    this.classService.getAll().subscribe({
      next: (res) => {
        this.classes = res || [];
      },
      error: () => {
        this.classes = [];
      }
    });
  }

  nextStep(): void {
    if (this.isStepValid()) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(): boolean {
    if (!this.studentForm) return false;

    switch (this.currentStep) {
      case 1:
        return this.studentForm.get('firstName')?.valid === true &&
          this.studentForm.get('lastName')?.valid === true &&
          this.studentForm.get('dateOfBirth')?.valid === true &&
          this.studentForm.get('gender')?.valid === true;

      case 2:
        return this.studentForm.get('phone')?.valid === true &&
          this.studentForm.get('email')?.valid === true;

      case 3:
        return this.studentForm.get('enrollmentDate')?.valid === true &&
          this.studentForm.get('classId')?.valid === true &&
          this.studentForm.get('studentIdNumber')?.valid === true &&
          this.studentForm.get('matricule')?.valid === true;

      case 4:
        return true;

      default:
        return false;
    }
  }


  async onSubmit(): Promise<void> {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.value;
      // Construction du payload attendu par le backend
      const payload: CreateStudentRequest = {
        first_name: formValue.firstName,
        last_name: formValue.lastName,
        date_of_birth: formValue.dateOfBirth,
        gender: formValue.gender,
        phone: formValue.phone,
        email: formValue.email,
        address: formValue.address,
        enrollment_date: formValue.enrollmentDate,
        class_id: formValue.classId,
        parent_user_id: formValue.parentUserId,
        role_id: 3,
        tutor_phone_number: formValue.parentPhone
      };
      try {

        this.studentService.createStudent(payload)
        await this.router.navigate(['/students/list']);
      } catch (e) {
        alert('Erreur lors de l\'ajout de l\'étudiant.: ' + e);
      }
    }
  }
}
