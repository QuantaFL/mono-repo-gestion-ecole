import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClassService} from '../../../class/services/class.service';
import {ClassModel} from '../../../class/models/class';
import {StudentService} from '../../services/student.service';
import {Router} from '@angular/router';
import {AcademicYearService} from '../../services/academic-year.service';
import {AcademicYear} from '../../../teacher-dashboard/models/academic-year';
import {ToastrService} from "ngx-toastr";

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
  academicRecordsFile: File | null = null;
  studentPhotoFile: File | null = null;

  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private academicYearService: AcademicYearService,
    private router: Router,
    private toastr: ToastrService
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

    // TODO: Remove these default values after testing (for developer convenience)
    this.studentForm.patchValue({
      student_first_name: 'TestFirst',
      student_last_name: 'TestLast',
      student_birthday: '2010-01-01',
      student_gender: 'M',
      student_phone: '770000000',
      student_email: 'test.student@example.com',
      student_adress: '123 Test Street',
      student_role_id: 3,
      class_model_id: '', // Set after classes load if needed
      academic_year_id: '', // Set by service
      academic_records: '',
      parent_first_name: 'ParentFirst',
      parent_last_name: 'ParentLast',
      parent_email: 'parent@example.com',
      parent_phone: '780000000',
      parent_adress: '456 Parent Ave',
      parent_birthday: '1980-01-01',
      parent_gender: 'F',
      parent_role_id: 4
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
          this.studentForm.get('student_adress')?.valid === true;
      case 2:
        return this.studentForm.get('class_model_id')?.valid === true &&
          this.studentForm.get('academic_records')?.valid === true;
      case 3:
        return this.studentForm.get('parent_first_name')?.valid === true &&
          this.studentForm.get('parent_last_name')?.valid === true &&
          this.studentForm.get('parent_email')?.valid === true &&
          this.studentForm.get('parent_phone')?.valid === true &&
          this.studentForm.get('parent_adress')?.valid === true &&
          this.studentForm.get('parent_birthday')?.valid === true &&
          this.studentForm.get('parent_gender')?.valid === true;
      default:
        return false;
    }
  }

  onAcademicRecordsFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.academicRecordsFile = input.files[0];
    } else {
      this.academicRecordsFile = null;
    }
  }

  onStudentPhotoFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.studentPhotoFile = input.files[0];
      console.log('Photo sélectionnée:', this.studentPhotoFile);
    } else {
      this.studentPhotoFile = null;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.studentForm.valid) {
      const formValue = this.studentForm.getRawValue();
      const formData = new FormData();
      Object.keys(formValue).forEach(key => {
        formData.append(key, formValue[key]);
      });
      if (this.academicRecordsFile) {
        formData.append('academic_records', this.academicRecordsFile);
        console.log('Nom du fichier academic_records envoyé:', this.academicRecordsFile.name);
      }
      if (this.studentPhotoFile) {
        formData.append('photo', this.studentPhotoFile);
        console.log('Nom du fichier photo envoyé:', this.studentPhotoFile.name);
      }
      // Log du contenu du FormData
      for (const pair of formData.entries()) {
        console.log('FormData:', pair[0], pair[1]);
      }
      console.log('Payload FormData envoyé au backend:', formData);
      try {
        this.studentService.createStudent(formData).subscribe({
          next: async (res) => {
            console.log('Réponse du backend:', res);
            this.toastr.success('Étudiant ajouté avec succès !', 'Succès');
            await this.router.navigate(['/dashboard']);
          },
          error: (e) => {
            console.error('Erreur backend:', e);
            console.error('Erreur lors de l\'ajout de l\'étudiant.: ' + JSON.stringify(e?.error));
            this.toastr.error("Erreur lors de l'ajout de l'étudiant: " + e?.error?.message || 'Veuillez vérifier les données saisies.', 'Erreur');
          }
        });
      } catch (e) {
        console.error('Erreur lors de l\'ajout de l\'étudiant.: ' + e);
        this.toastr.error("Erreur lors de l'ajout de l'étudiant: " + e || 'Veuillez vérifier les données saisies.', 'Erreur');
      }
    }
  }
}
