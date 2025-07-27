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
      student_first_name: new FormControl('', Validators.required),
      student_last_name: new FormControl('', Validators.required),
      student_birthday: new FormControl('', Validators.required),
      student_gender: new FormControl('', Validators.required),
      student_phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(7[05678])[0-9]{7}$/)
      ]),
      student_email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      student_adress: new FormControl('', Validators.required),
      student_matricule: new FormControl('', Validators.required),
      student_password: new FormControl('', Validators.required),
      student_role_id: new FormControl(3, Validators.required),

      // Étape 2 — infos scolaires
      class_model_id: new FormControl('', Validators.required),
      academic_year_id: new FormControl('', Validators.required),
      academic_records: new FormControl(''),

      // Étape 3 — infos du parent
      parent_first_name: new FormControl('', Validators.required),
      parent_last_name: new FormControl('', Validators.required),
      parent_email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      parent_password: new FormControl('', Validators.required),
      parent_phone: new FormControl('', Validators.required),
      parent_adress: new FormControl('', Validators.required),
      parent_birthday: new FormControl('', Validators.required),
      parent_gender: new FormControl('', Validators.required),
      parent_role_id: new FormControl(4, Validators.required),
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
      const payload: CreateStudentRequest = {
        ...formValue
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
