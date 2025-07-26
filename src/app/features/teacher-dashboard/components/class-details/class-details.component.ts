import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { Term } from '../../models/term';
import { Grade } from '../../models/grade';
import { StudentSession } from '../../models/student-session';
import { Subject } from '../../models/subject';
import { Dialog } from '@angular/cdk/dialog';
import { StudentDetailsModalComponent } from '../student-details-modal/student-details-modal.component';
import {Assignment} from "../../models/assignment";

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss'
})
export class ClassDetailsComponent implements OnInit {
  classId: number | null = null;
  terms: Term[] = [];
  assignement: Assignment | null = null;
  selectedTerm: Term | null = null;
  grades: Grade[] = [];
  students: StudentSession[] = [];
  subjects: Subject[] = []; // To store subjects taught in this class by the teacher

  displayedColumns: string[] = [];

  // Placeholder for academic year. In a real app, this would be passed or fetched.
  currentAcademicYearId: number = 1;
  currentTeacherId: number = 3; // Placeholder

  constructor(
    private route: ActivatedRoute,
    private teacherDashboardService: TeacherDashboardService,
    private dialog: Dialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.classId = Number(params.get('id'));
      if (this.classId) {
        this.fetchTerms();
      }
    });
  }

  fetchTerms(): void {
    this.teacherDashboardService.getTerms(this.currentAcademicYearId).subscribe({
      next: (terms: Term[]) => {
        this.terms = terms;
        // Select the first term by default or the active one
        this.selectedTerm = terms[0];
        if (this.selectedTerm && this.classId) {
          this.fetchGrades();
        }
      },
      error: (err: any) => {
        console.error('Error fetching terms:', err);
      }
    });
  }

  fetchGrades(): void {
    if (this.selectedTerm && this.classId) {
      const defaultSubjectId = this.grades.at(0)?.subject?.id!;
      this.teacherDashboardService.getGrades(this.selectedTerm.id, this.classId, defaultSubjectId).subscribe({
        next: (grades) => {
          this.grades = grades;
          this.extractStudentsAndSubjects(grades);
          this.setDisplayedColumns();
        },
        error: (err) => {
          console.error('Error fetching grades:', err);
        }
      });
    }
  }

  extractStudentsAndSubjects(grades: Grade[]): void {
    const uniqueStudents = new Map<number, StudentSession>();
    const uniqueSubjects = new Map<number, Subject>();

    grades.forEach(grade => {
      if (!uniqueStudents.has(grade.student_session.id)) {
        uniqueStudents.set(grade.student_session.id, grade.student_session);
      }
      if (!uniqueSubjects.has(grade.assignement.subject!.id!)) {
        uniqueSubjects.set(grade!.assignement!.subject!.id!, grade!.assignement!.subject!);
      }
    });

    this.students = Array.from(uniqueStudents.values());
    this.subjects = Array.from(uniqueSubjects.values());
  }

  setDisplayedColumns(): void {
    this.displayedColumns = ['studentName'];
    this.subjects.forEach(subject => {
      this.displayedColumns.push(`${subject.id}-quiz`);
      this.displayedColumns.push(`${subject.id}-exam`);
    });
    this.displayedColumns.push('info');
  }

  onTermChange(): void {
    if (this.selectedTerm && this.classId) {
      this.fetchGrades();
    }
  }

  getGrade(studentSessionId: number, subjectId: number, type: 'quiz' | 'exam'): string {
    const grade = this.grades.find(g =>
      g.student_session.id === studentSessionId &&
      g.assignement!.subject!.id! === subjectId &&
      g.type === type
    );
    return grade ? grade.mark : '';
  }

  updateGrade(studentSessionId: number, subjectId: number, type: 'quiz' | 'exam', event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const mark = inputElement.value;

    // Validate mark input
    const parsedMark = parseFloat(mark);
    if (isNaN(parsedMark) || parsedMark < 0 || parsedMark > 20) {
      alert('Veuillez entrer une note valide entre 0 et 20.');
      inputElement.value = this.getGrade(studentSessionId, subjectId, type); // Revert to previous valid value
      return;
    }

    let grade = this.grades.find(g =>
      g.student_session.id === studentSessionId &&
      g.assignement.subject!.id! === subjectId &&
      g.type === type
    );

    if (grade) {
      grade.mark = mark;
    } else {
      // Find the assignment_id for the given subject and class
      const assignment = this.grades.find(g =>
        g.assignement.subject!.id! === subjectId &&
        g.assignement.class_model_id === this.classId
      )?.assignement;

      if (assignment) {
        this.grades.push({
          id: 0, // Placeholder, will be assigned by backend
          mark: mark,
          type: type,
          assignement_id: assignment.id,
          student_session_id: studentSessionId,
          subject_id: subjectId,
          term_id: this.selectedTerm?.id || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          student_session: this.students.find(s => s.id === studentSessionId) as StudentSession,
          assignement: assignment
        });
      } else {
        console.warn('Assignment not found for subject', subjectId, 'and class', this.classId);
      }
    }
  }

  saveGrades(): void {
    const gradesToUpdate = this.grades.map(g => ({
      student_session_id: g.student_session_id,
      term_id: g.term_id,
      assignement_id: g.assignement_id,
      mark: parseFloat(g.mark),
      type: g.type
    }));

    this.teacherDashboardService.updateGrades(gradesToUpdate).subscribe({
      next: (res) => {
        console.log('Notes enregistrées avec succès:', res);
        alert('Notes enregistrées avec succès !');
      },
      error: (err) => {
        console.error('Erreur lors de l\'enregistrement des notes:', err);
        alert('Erreur lors de l\'enregistrement des notes. Veuillez vérifier la console pour plus de détails.');
      }
    });
  }

  isTermClosed(): boolean {
    if (!this.selectedTerm) {
      return true; // Or handle as appropriate
    }
    const endDate = new Date(this.selectedTerm.end_date);
    const today = new Date();
    return today > endDate;
  }

  submitTermGrades(): void {
    if (!this.selectedTerm) {
      alert('Veuillez sélectionner un terme d\'abord.');
      return;
    }

    if (!this.isTermClosed()) {
      alert('Le terme n\'est pas encore clôturé. Les notes ne peuvent être soumises qu\'après la date de fin du terme.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir soumettre les notes pour ce terme ? Cette action est irréversible.')) {
      // Assuming a new API endpoint for closing the term
      this.teacherDashboardService.closeTerm(this.selectedTerm.id).subscribe({
        next: (res) => {
          console.log('Notes du terme soumises avec succès:', res);
          alert('Notes du terme soumises avec succès !');
          // Optionally, refresh grades or disable further editing
          this.fetchGrades();
        },
        error: (err) => {
          console.error('Erreur lors de la soumission des notes du terme:', err);
          alert('Erreur lors de la soumission des notes du terme. Veuillez vérifier la console pour plus de détails.');
        }
      });
    }
  }

  showStudentInfo(studentSession: StudentSession) {
    this.dialog.open(StudentDetailsModalComponent, {
      data: studentSession,
      panelClass: 'custom-dialog-container' // Optional: for custom styling
    });
  }
}
