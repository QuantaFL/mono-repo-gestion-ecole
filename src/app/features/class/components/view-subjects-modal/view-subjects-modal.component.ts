import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { ClassService } from '../../services/class.service';
import { ClassModel } from '../../../teacher-dashboard/models/class-model';

@Component({
  selector: 'app-view-subjects-modal',
  templateUrl: './view-subjects-modal.component.html',
  styleUrls: ['./view-subjects-modal.component.scss']
})
export class ViewSubjectsModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() selectedClass: ClassModel | null = null;
  @Output() close = new EventEmitter<void>();

  classDetails: any = null;
  loading = false;
  error: string | null = null;

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
    if (this.isOpen && this.selectedClass) {
      this.loadClassWithSubjects();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen && this.selectedClass) {
      this.loadClassWithSubjects();
    }
  }

  loadClassWithSubjects(): void {
    if (!this.selectedClass?.id) return;
    
    this.loading = true;
    this.error = null;
    
    console.log('Loading subjects for class:', this.selectedClass);
    
    this.classService.getById(this.selectedClass.id).subscribe({
      next: (classData) => {
        this.classDetails = classData;
        this.loading = false;
        console.log('Class details with subjects:', classData);
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des matières';
        this.loading = false;
        console.error('Error loading class subjects:', error);
      }
    });
  }

  closeModal(): void {
    this.isOpen = false;
    this.classDetails = null;
    this.error = null;
    this.close.emit();
  }
}