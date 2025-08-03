import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject.model';
import { ClassModel } from '../../../teacher-dashboard/models/class-model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-subject-modal',
  templateUrl: './assign-subject-modal.component.html',
  styleUrls: ['./assign-subject-modal.component.scss']
})
export class AssignSubjectModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() selectedClass: ClassModel | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() subjectAssigned = new EventEmitter<any>();

  subjects: Subject[] = [];
  selectedSubjectId: number | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private subjectService: SubjectService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.isOpen) {
      this.loadSubjects();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.loadSubjects();
    }
  }

  loadSubjects(): void {
    this.loading = true;
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects.filter(s => s.status === true);
        this.loading = false;
        console.log('Subjects loaded:', subjects);
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des matières';
        this.loading = false;
        console.error('Error loading subjects:', error);
      }
    });
  }

  onSubjectSelect(subjectId: number): void {
    this.selectedSubjectId = subjectId;
    console.log('Subject selected:', subjectId);
  }

  assignSubject(): void {
    if (!this.selectedClass || !this.selectedSubjectId) {
      this.error = 'Veuillez sélectionner une matière';
      return;
    }

    this.loading = true;
    this.error = null;

    const request = {
      class_id: this.selectedClass.id!,
      subject_id: this.selectedSubjectId
    };

    console.log('Assigning subject to class:', request);

    this.subjectService.assignSubjectToClass(request).subscribe({
      next: (response) => {
        console.log('Subject assigned successfully:', response);
        this.toastr.success(`Matière assignée avec succès à la classe ${this.selectedClass?.name}`, 'Succès');
        this.subjectAssigned.emit(response);
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors de l\'assignation de la matière';
        this.toastr.error('Erreur lors de l\'assignation de la matière', 'Erreur');
        this.loading = false;
        console.error('Error assigning subject:', error);
      }
    });
  }

  closeModal(): void {
    this.isOpen = false;
    this.selectedSubjectId = null;
    this.error = null;
    this.close.emit();
  }
}