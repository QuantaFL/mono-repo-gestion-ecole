import {Component, Inject, OnInit} from '@angular/core';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {Student} from '../../../students/models/student';
import {TeacherDashboardService} from '../../services/teacher-dashboard.service';
import {ReportCard} from '../../models/report-card';

@Component({
  selector: 'app-student-details-modal',
  templateUrl: './student-details-modal.component.html',
  styleUrl: './student-details-modal.component.scss'
})
export class StudentDetailsModalComponent implements OnInit {
  reportCards: ReportCard[] = [];

  constructor(
    public dialogRef: DialogRef<StudentDetailsModalComponent>,
    @Inject(DIALOG_DATA) public student: Student,
    private teacherDashboardService: TeacherDashboardService
  ) { }

  ngOnInit(): void {
    if (this.student && this.student.id) {
      this.teacherDashboardService.getReportCardsForStudent(this.student.id).subscribe({
        next: (data) => {
          this.reportCards = data;
        },
        error: (error) => {
          console.error('Error fetching report cards:', error);
        }
      });
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
