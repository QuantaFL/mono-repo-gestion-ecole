import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { StudentSession } from '../../models/student-session';

@Component({
  selector: 'app-student-details-modal',
  templateUrl: './student-details-modal.component.html',
  styleUrl: './student-details-modal.component.scss'
})
export class StudentDetailsModalComponent {
  constructor(
    public dialogRef: DialogRef<StudentDetailsModalComponent>,
    @Inject(DIALOG_DATA) public studentSession: StudentSession
  ) { }

  closeModal(): void {
    this.dialogRef.close();
  }
}
