import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TeacherService} from "../../services/teacher.service";
import {SubjectService} from "../../../subjects/services/subject.service";
import {ClassService} from "../../../class/services/class.service";
import {Subject} from "../../../subjects/models/subject";
import {ClassModel} from "../../../class/models/class";
import {CreateTeacherRequest} from "../../requests/createTeacherRequest";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrl: './add-teacher.component.scss'
})
export class AddTeacherComponent implements OnInit {
  currentStep = 0;
  totalSteps = 4;
  
  // Formulaires séparés pour chaque étape
  personalInfoForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    birthday: new FormControl('', [Validators.required]),
    gender: new FormControl('M', [Validators.required]),
    nationality: new FormControl('', [Validators.required])
  });

  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required])
  });

  professionalForm = new FormGroup({
    hireDate: new FormControl('', [Validators.required]),
    subjectId: new FormControl('', [Validators.required]),
    classModelId: new FormControl('', [Validators.required]),
    coefficient: new FormControl('', [Validators.required, Validators.min(1)])
  });

  scheduleForm = new FormGroup({
    dayOfWeek: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required])
  });

  subjects: Subject[] = [];
  classes: ClassModel[] = [];
  
  steps = [
    { 
      title: 'Informations personnelles',
      subtitle: 'Renseignez les données personnelles de l\'enseignant',
      form: this.personalInfoForm,
      icon: '👤'
    },
    { 
      title: 'Informations de contact',
      subtitle: 'Coordonnées et adresse de l\'enseignant',
      form: this.contactForm,
      icon: '📧'
    },
    { 
      title: 'Informations professionnelles',
      subtitle: 'Matière, classe et date d\'embauche',
      form: this.professionalForm,
      icon: '💼'
    },
    { 
      title: 'Emploi du temps',
      subtitle: 'Planification des cours',
      form: this.scheduleForm,
      icon: '📅'
    }
  ];

  daysOfWeek = [
    { value: 'monday', label: 'Lundi' },
    { value: 'tuesday', label: 'Mardi' },
    { value: 'wednesday', label: 'Mercredi' },
    { value: 'thursday', label: 'Jeudi' },
    { value: 'friday', label: 'Vendredi' },
    { value: 'saturday', label: 'Samedi' },
    { value: 'sunday', label: 'Dimanche' }
  ];
  
  genders = [
    { value: 'M', label: 'Masculin' },
    { value: 'F', label: 'Féminin' }
  ];

  constructor(
    private router: Router,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classService: ClassService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
    this.loadClasses();
  }

  loadSubjects(): void {
    this.subjectService.getAllSubject().subscribe({
      next: (subjects) => {
        this.subjects = subjects;
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
      }
    });
  }

  loadClasses(): void {
    this.classService.getAllClasses().subscribe({
      next: (classes) => {
        this.classes = classes;
      },
      error: (err) => {
        console.error('Error loading classes:', err);
      }
    });
  }

  nextStep(): void {
    if (this.isCurrentStepValid() && this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    // Permet de naviguer vers une étape seulement si toutes les étapes précédentes sont valides
    if (step <= this.currentStep || this.areAllPreviousStepsValid(step)) {
      this.currentStep = step;
    }
  }

  isCurrentStepValid(): boolean {
    return this.steps[this.currentStep].form.valid;
  }

  areAllPreviousStepsValid(targetStep: number): boolean {
    for (let i = 0; i < targetStep; i++) {
      if (!this.steps[i].form.valid) {
        return false;
      }
    }
    return true;
  }

  canProceedToStep(stepIndex: number): boolean {
    return stepIndex <= this.currentStep || this.areAllPreviousStepsValid(stepIndex);
  }

  isStepCompleted(stepIndex: number): boolean {
    return stepIndex < this.currentStep || this.steps[stepIndex].form.valid;
  }

  getAllFormData(): any {
    return {
      ...this.personalInfoForm.value,
      ...this.contactForm.value,
      ...this.professionalForm.value,
      ...this.scheduleForm.value
    };
  }

  onSubmit(): void {
    if (this.areAllFormsValid()) {
      const formData = this.getAllFormData();
      const teacherData: CreateTeacherRequest = {
        hire_date: formData.hireDate ?? '',
        role_id: 2,
        nationality: formData.nationality ?? '',
        user: {
          first_name: formData.firstName ?? '',
          last_name: formData.lastName ?? '',
          birthday: formData.birthday ?? '',
          email: formData.email ?? '',
          password: 'MotDePasseSecurise123!',
          adress: formData.address ?? '',
          phone: formData.phone ?? '',
          gender: formData.gender ?? 'M'
        },
        assignment: {
          subject_id: Number(formData.subjectId) || 0,
          class_model_id: Number(formData.classModelId) || 0,
          day_of_week: formData.dayOfWeek ?? '',
          start_time: formData.startTime ?? '',
          end_time: formData.endTime ?? '',
          coefficient: Number(formData.coefficient) || 1
        }
      };
      
      console.log('Sending teacher data:', teacherData);
      
      this.teacherService.createTeacher(teacherData).subscribe({
        next: (res) => {
          console.log('Teacher created:', res);
          this.toast.success('Enseignant créé avec succès', 'Succès');
          this.router.navigateByUrl('/list_teacher');
        },
        error: (err) => {
          this.toast.error('Erreur lors de l\'enregistrement de l\'enseignant', 'Erreur');
          console.error('Error creating teacher:', err);
        }
      });
    } else {
      console.log('Some forms are invalid');
      this.markAllFormsAsTouched();
    }
  }

  areAllFormsValid(): boolean {
    return this.personalInfoForm.valid && 
           this.contactForm.valid && 
           this.professionalForm.valid && 
           this.scheduleForm.valid;
  }

  markAllFormsAsTouched(): void {
    this.personalInfoForm.markAllAsTouched();
    this.contactForm.markAllAsTouched();
    this.professionalForm.markAllAsTouched();
    this.scheduleForm.markAllAsTouched();
  }

  getSelectedSubjectName(): string {
    const subjectId = this.professionalForm.get('subjectId')?.value;
    const subject = this.subjects.find(s => s.id === Number(subjectId));
    return subject?.name || '';
  }

  getSelectedClassName(): string {
    const classId = this.professionalForm.get('classModelId')?.value;
    const classModel = this.classes.find(c => c.id === Number(classId));
    return classModel?.name || '';
  }
}
