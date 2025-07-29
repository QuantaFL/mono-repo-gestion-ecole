import {Component, OnInit} from '@angular/core';
import {TeacherDashboardService} from '../../services/teacher-dashboard.service';
import {Assignment} from '../../models/assignment';
import {TeacherStore} from '../../services/teacher.store';
import {CommonModule} from '@angular/common';
import { Teacher } from '../../models/teacher';

interface TimetableSlot {
  subject: string;
  className: string;
  startTime: string;
  endTime: string;
  color: string;
}

@Component({
  selector: 'app-teacher-timetable',
  templateUrl: './teacher-timetable.component.html',
  styleUrls: ['./teacher-timetable.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TeacherTimetableComponent implements OnInit {
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  timeSlots = this.generateTimeSlots('08:00', '17:00', 60);
  timetable: { [key: string]: { [key: string]: TimetableSlot } } = {};
  private subjectColorMap = new Map<string, string>();
  private colorPalette = ['#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF', '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'];

  constructor(
    private teacherDashboardService: TeacherDashboardService,
    private teacherStore: TeacherStore
  ) {
  }

  ngOnInit(): void {
    this.initializeTimetable();
    this.teacherStore.currentTeacher$.subscribe((teacher: Teacher | null) => {
      if (teacher) {
        this.teacherDashboardService.getAssignmentsForTeacher(teacher.id).subscribe(assignments => {
          console.log(assignments);
          this.processAssignments(assignments);
        });
      }
    });
  }

  private initializeTimetable(): void {
    this.daysOfWeek.forEach(day => {
      this.timetable[day] = {};
    });
  }

  private generateTimeSlots(start: string, end: string, interval: number): string[] {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (currentTime < endTime) {
      slots.push(currentTime.toTimeString().substring(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
    return slots;
  }

  private processAssignments(assignments: Assignment[]): void {
    assignments.forEach(assignment => {
      if (assignment.day_of_week && assignment.start_time && assignment.end_time && assignment.subject && assignment.classModel) {
        const days = Array.isArray(assignment.day_of_week) ? assignment.day_of_week : [assignment.day_of_week];
        const startTime = assignment.start_time.substring(0, 5);

        if (!this.subjectColorMap.has(assignment.subject.name)) {
          const colorIndex = this.subjectColorMap.size % this.colorPalette.length;
          this.subjectColorMap.set(assignment.subject.name, this.colorPalette[colorIndex]);
        }
        const color = this.subjectColorMap.get(assignment.subject.name) || '#FFFFFF';

        days.forEach(day => {
          this.timetable[day][startTime] = {
            subject: assignment!.subject!.name,
            className: assignment!.classModel!.name,
            startTime: startTime,
            endTime: assignment!.end_time!.substring(0, 5),
            color: color,
          };
        });
      }
    });
  }
}
