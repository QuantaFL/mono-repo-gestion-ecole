import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
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

  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.isOpen && this.selectedClass) {
      this.loadClassData();
    }
  }

  ngOnChanges(): void {
    if (this.isOpen && this.selectedClass) {
      this.loadClassData();
    }
  }

  loadClassData(): void {
    // Utilisez directement les données de la classe passée en input
    // Pas besoin d'appel API supplémentaire
    this.loading = false;
    this.error = null;
    
    console.log('Using cached class data with subjects:', this.selectedClass);
    
    if (this.selectedClass && !this.selectedClass.subjects) {
      console.warn('Class data does not contain subjects. You may need to ensure the API returns subjects with classes.');
    }
  }

  get classSubjects() {
    return this.selectedClass?.subjects || [];
  }

  closeModal(): void {
    this.isOpen = false;
    this.error = null;
    this.close.emit();
  }
}