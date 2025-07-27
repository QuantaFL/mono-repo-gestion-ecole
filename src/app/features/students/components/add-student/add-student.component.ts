import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ClassService } from '../../../class/services/class.service';
import { ClassModel } from '../../../class/models/class';
import { StudentService } from '../../services/student.service';
import { Router } from '@angular/router';
import {CreateStudentRequest} from "../../requests/createStudentRequest";
import { AcademicYearService } from '../../services/academic-year.service';
import { AcademicYear } from '../../../teacher-dashboard/models/academic-year';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  studentForm!: FormGroup;
  currentStep: number = 1;
  classes: ClassModel[] = [];
  currentAcademicYear?: AcademicYear;

  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private academicYearService: AcademicYearService,
    private router: Router
  ) {}

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
      next: (res: ClassModel[]) => {
        this.classes = res || [];
      },
      error: () => {
        this.classes = [];
      }
    });
    // Préremplir l'année académique depuis le service et la griser
    this.academicYearService.getCurrentAcademicYear().subscribe({
      next: (year) => {
        this.currentAcademicYear = year;
        this.studentForm.get('academic_year_id')?.setValue(year.id);
        this.studentForm.get('academic_year_id')?.disable();
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
        return this.studentForm.get('student_first_name')?.valid === true &&
          this.studentForm.get('student_last_name')?.valid === true &&
          this.studentForm.get('student_birthday')?.valid === true &&
          this.studentForm.get('student_gender')?.valid === true &&
          this.studentForm.get('student_phone')?.valid === true &&
          this.studentForm.get('student_email')?.valid === true &&
          this.studentForm.get('student_adress')?.valid === true &&
          this.studentForm.get('student_matricule')?.valid === true &&
          this.studentForm.get('student_password')?.valid === true;
      case 2:
        // Ne valide que la classe, car academic_year_id est hidden et toujours rempli
        return this.studentForm.get('class_model_id')?.valid === true;
      case 3:
        return this.studentForm.get('parent_first_name')?.valid === true &&
          this.studentForm.get('parent_last_name')?.valid === true &&
          this.studentForm.get('parent_email')?.valid === true &&
          this.studentForm.get('parent_password')?.valid === true &&
          this.studentForm.get('parent_phone')?.valid === true &&
          this.studentForm.get('parent_adress')?.valid === true &&
          this.studentForm.get('parent_birthday')?.valid === true &&
          this.studentForm.get('parent_gender')?.valid === true;
      default:
        return false;
    }
  }


  async onSubmit(): Promise<void> {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.getRawValue(); // getRawValue pour inclure les champs disabled
      console.log('Payload envoyé au backend:', formValue);
      const payload: CreateStudentRequest = {
        ...formValue
      };
      try {
        this.studentService.createStudent(payload).subscribe({
          next: (res) => {
            console.log('Réponse du backend:', res);
            this.router.navigate(['/students/list']);
          },
          error: (e) => {
            console.error('Erreur backend:', e);
            alert('Erreur lors de l\'ajout de l\'étudiant.: ' + JSON.stringify(e?.error));
          }
        });
      } catch (e) {
        alert('Erreur lors de l\'ajout de l\'étudiant.: ' + e);
      }
    }
  }
}
