import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Teacher } from '../../models/teacher';

@Component({
  selector: 'app-termination-confirm-modal',
  templateUrl: './termination-confirm-modal.component.html',
  styleUrls: ['./termination-confirm-modal.component.scss']
})
export class TerminationConfirmModalComponent {
  @Input() isOpen = false;
  @Input() selectedTeacher: Teacher | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<Teacher>();

  confirmTermination(): void {
    if (this.selectedTeacher) {
      this.confirm.emit(this.selectedTeacher);
    }
  }

  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
  }
}