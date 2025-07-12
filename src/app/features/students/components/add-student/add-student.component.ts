import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {
  studentForm!: FormGroup;
  currentStep: number = 1;

  classes = [
    { id: 1, name: '6ème A' },
    { id: 2, name: '5ème B' },
    { id: 3, name: '4ème C' }
    // À remplacer plus tard par un appel à l’API
  ];

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
      parentUserId: new FormControl(null, Validators.min(1))
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


  onSubmit(): void {
    if (this.studentForm.valid) {
      console.log('Formulaire élève :', this.studentForm.value);
      // TODO: envoyer au backend quand prêt
    } else {
      console.log('Formulaire invalide');
    }
  }
}
