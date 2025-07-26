import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { Term } from '../../models/term';
import { Grade } from '../../models/grade';
import { StudentSession } from '../../models/student-session';
import { Subject } from '../../models/subject';
import { Dialog } from '@angular/cdk/dialog';
import { StudentDetailsModalComponent } from '../student-details-modal/student-details-modal.component';
import { Assignment } from "../../models/assignment";
import { Student } from '../../models/student';
import { forkJoin } from 'rxjs';
import { TeacherStore } from '../../services/teacher.store';
import { ClassModel } from '../../models/class-model';

@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss'
})
export class ClassDetailsComponent implements OnInit {
  classId: number | null = null;
  currentClass: ClassModel | null = null;
  currentTerm: Term | null = null;
  grades: Grade[] = [];
  students: Student[] = [];
  uniqueSubjects: Subject[] = [];
  gradeTypes: string[] = ['exam', 'quiz']; // Assuming these are the primary grade types

  constructor(
    private route: ActivatedRoute,
    private teacherDashboardService: TeacherDashboardService,
    private dialog: Dialog,
    private teacherStore: TeacherStore
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.classId = Number(params.get('id'));
      if (this.classId) {
        this.fetchClassDetailsAndGrades();
      }
    });
  }

  fetchClassDetailsAndGrades(): void {
    if (!this.classId) return;

    forkJoin({
      currentTerm: this.teacherDashboardService.getCurrentTerm(),
      currentClass: this.teacherDashboardService.getClassById(this.classId)
    }).subscribe({
      next: ({ currentTerm, currentClass }) => {
        this.currentTerm = currentTerm;
        this.currentClass = currentClass;
        this.students = currentClass.current_academic_year_student_sessions.map((session: StudentSession) => session.student);
        this.fetchGradesForAllStudents();
        console.log('Class details and students fetched successfully:', this.currentClass, this.students);
      },
      error: (err: any) => {
        console.error('Error fetching class details or students:', err);
      }
    });
  }

  fetchGradesForAllStudents(): void {
    if (!this.classId || !this.currentTerm || this.students.length === 0) return;

    const gradeObservables = this.students.filter(student => student && student.id).map(student =>
      this.teacherDashboardService.getGradesForStudentInClassTerm(this.classId!, this.currentTerm!.id, student!.latest_student_session?.id!)
    );

    forkJoin(gradeObservables).subscribe({
      next: (allStudentGrades: Grade[][]) => {
        this.grades = allStudentGrades.flat();
        this.extractUniqueSubjectsAndGradeTypes();
      },
      error: (err: any) => {
        console.error('Error fetching grades for students:', err);
      }
    });
  }

  extractUniqueSubjectsAndGradeTypes(): void {
    const subjectMap = new Map<number, Subject>();
    const gradeTypeSet = new Set<string>();

    this.grades.forEach(grade => {
      if (grade.assignement.subject && !subjectMap.has(grade.assignement.subject.id)) {
        subjectMap.set(grade.assignement.subject.id, grade.assignement.subject);
      }
      if (grade.type) {
        gradeTypeSet.add(grade.type);
      }
    });

    this.uniqueSubjects = Array.from(subjectMap.values());
    this.gradeTypes = Array.from(gradeTypeSet);
  }

  getGrade(studentId: number, subjectId: number, type: string): number | null {
    const grade = this.grades.find(g =>
      g.student_session.student.id === studentId &&
      g.assignement.subject?.id === subjectId &&
      g.type === type
    );
    return grade ? grade.mark : null;
  }

  updateGrade(studentId: number, subjectId: number, type: string, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const mark = parseFloat(inputElement.value);
    if (isNaN(mark) || mark < 0 || mark > 20) {
      alert('Veuillez entrer une note valide entre 0 et 20.');
      inputElement.value = this.getGrade(studentId, subjectId, type)?.toString() || '';
      return;
    }

    let grade = this.grades.find(g =>
      g.student_session.student.id === studentId &&
      g.assignement.subject?.id === subjectId &&
      g.type === type
    );

    if (grade) {
      grade.mark = mark;
    } else {
      // Create a new grade object if it doesn't exist
      const studentSession = this.students.find(s => s.id === studentId)?.latest_student_session; // latest_student_session is not an array
      const subject = this.uniqueSubjects.find(s => s.id === subjectId);

      if (studentSession && subject && this.currentTerm) {
        const newGrade: Grade = {
          id: 0, // Will be assigned by the backend
          mark: mark,
          type: type,
          assignement_id: 0, // This needs to be handled. PRD doesn't specify how assignments are linked.
          student_session_id: studentSession.id,
          term_id: this.currentTerm.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          student_session: studentSession,
          assignement: { id: 0, teacher_id: 0, class_model_id: this.classId!, subject_id: subject.id, term_id: this.currentTerm.id, created_at: '', updated_at: '' }, // Placeholder assignment
          term: this.currentTerm
        };
        this.grades.push(newGrade);
      } else {
        console.warn('Could not create new grade: missing student session, subject, or current term.');
      }
    }
  }

  saveGrades(): void {
    const gradesToUpdate = this.grades.map(g => ({
      id: g.id === 0 ? undefined : g.id, // Send id only if it's an existing grade
      mark: g.mark as number,
      type: g.type,
      assignement_id: g.assignement_id, // This needs to be correctly populated
      student_session_id: g.student_session_id,
      term_id: g.term_id
    }));

    this.teacherDashboardService.updateGrades(gradesToUpdate).subscribe({
      next: (res) => {
        console.log('Notes enregistrées avec succès:', res);
        alert('Notes enregistrées avec succès !');
        this.fetchGradesForAllStudents(); // Re-fetch to get updated IDs for new grades
      },
      error: (err) => {
        console.error('Erreur lors de l\'enregistrement des notes:', err);
        alert('Erreur lors de l\'enregistrement des notes. Veuillez vérifier la console pour plus de détails.');
      }
    });
  }



  submitTermGrades(): void {
    if (!this.currentTerm || !this.classId) {
      alert('Terme ou classe non disponible.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir soumettre les notes pour ce terme ? Cette action est irréversible.')) {
      this.teacherDashboardService.submitTermNotes(this.classId, this.currentTerm.id).subscribe({
        next: (res) => {
          console.log('Notes du terme soumises avec succès:', res);
          alert('Notes du terme soumises avec succès !');
          this.fetchGradesForAllStudents(); // Refresh grades after submission
        },
        error: (err) => {
          console.error('Erreur lors de la soumission des notes du terme:', err);
          alert('Erreur lors de la soumission des notes du terme. Veuillez vérifier la console pour plus de détails.');
        }
      });
    }
  }

  showStudentInfo(student: Student) {
    this.dialog.open(StudentDetailsModalComponent, {
      data: student,
      panelClass: 'custom-dialog-container'
    });
  }
}
