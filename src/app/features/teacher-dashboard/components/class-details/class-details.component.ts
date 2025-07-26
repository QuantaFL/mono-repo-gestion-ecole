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
import { Student } from '../../../students/models/student';
import { forkJoin } from 'rxjs';
import { TeacherStore } from '../../services/teacher.store';
import {StudentService} from "../../../students/services/student.service";

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
  students: Student[] = []; // This will hold all students in the class
  subjects: Subject[] = []; // To store subjects taught in this class by the teacher

  displayedColumns: string[] = [];

  // Placeholder for academic year. In a real app, this would be passed or fetched.
  currentAcademicYearId: number = 1;
  currentTeacherId: number | null = null; // Now fetched from TeacherStore

  constructor(
    private route: ActivatedRoute,
    private teacherDashboardService: TeacherDashboardService,
    private dialog: Dialog,
    private teacherStore: TeacherStore,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.teacherStore.currentTeacher$.subscribe(teacher => {
      if (teacher && teacher.userModel && teacher.userModel.id) {
        this.currentTeacherId = teacher.userModel.id;
        this.route.paramMap.subscribe(params => {
          this.classId = Number(params.get('id'));
          if (this.classId) {
            this.fetchTermsAndStudents();
          }
        });
      } else {
        console.warn('Teacher data not available in store.');
      }
    });
  }

  fetchTermsAndStudents(): void {
    if (!this.classId) return;

    forkJoin({
      terms: this.teacherDashboardService.getTerms(this.currentAcademicYearId),
      students: this.teacherDashboardService.getStudentsByClassId(this.classId)
    }).subscribe({
      next: ({ terms, students }) => {
        this.terms = terms;
        this.students = students;
        this.selectedTerm = terms[0];
        if (this.selectedTerm && this.classId) {
          this.fetchGrades();
        }
      },
      error: (err: any) => {
        console.error('Error fetching terms or students:', err);
      }
    });
  }

  fetchGrades(): void {
    if (this.selectedTerm && this.classId && this.currentTeacherId) {
      const teacher = this.teacherStore.getCurrentTeacherValue();
      if (!teacher || !teacher.subjects) {
        console.warn('Teacher or teacher subjects not available in store.');
        return;
      }

      const relevantSubject = teacher.subjects.find(s => s.pivot.teacher_id === teacher.id);

      if (!relevantSubject) {
        console.warn('No relevant subject found for this teacher in this class.');
        this.grades = [];
        this.subjects = [];
        return;
      }

      this.teacherDashboardService.getGrades(this.selectedTerm.id, this.classId, relevantSubject.id).subscribe({
        next: (grades) => {
          this.grades = grades;
          this.setSubjectsForGradeDisplay();
        },
        error: (err) => {
          console.error('Error fetching grades:', err);
        }
      });
    }
  }

  setSubjectsForGradeDisplay(): void {
    const teacher = this.teacherStore.getCurrentTeacherValue();
    if (!teacher || !teacher.subjects) {
      console.warn('Teacher or teacher subjects not available for processing.');
      return;
    }

    // Populate subjects with the relevant subject(s) for this teacher in this class
    // For now, we'll use the first relevant subject found, as per fetchGrades assumption.
    const relevantSubject = teacher.subjects.find(s => s.pivot.teacher_id === teacher.id);
    if (relevantSubject) {
      this.subjects = [relevantSubject];
    } else {
      this.subjects = [];
    }

    // Ensure all students are represented, with their grades or placeholders
    const combinedStudents: Student[] = [];
    this.students.forEach(student => {
      // For each student, check if they have grades for the relevant subject
      const studentGrades = this.grades.filter(g => g.student_session.student.id === student.id);

      // You might want to create a more complex structure here if you need to display
      // grades for multiple subjects or different assignment types for each student.
      // For now, we'll just ensure the student is in the list.
      combinedStudents.push(student);
    });
    // This `this.students = combinedStudents;` is redundant as `this.students` is already populated from `fetchTermsAndStudents`
    // and we are just ensuring subjects are correctly set.
  }

  getGrade(studentId: number, subjectId: number, type: 'quiz' | 'exam'): string {
    const grade = this.grades.find(g =>
      g.student_session.student.id === studentId &&
      g.assignement?.subject?.id === subjectId &&
      g.type === type
    );
    return grade ? grade.mark : '';
  }

  updateGrade(studentId: number, subjectId: number, type: 'quiz' | 'exam', event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const mark = inputElement.value;

    const parsedMark = parseFloat(mark);
    if (isNaN(parsedMark) || parsedMark < 0 || parsedMark > 20) {
      alert('Veuillez entrer une note valide entre 0 et 20.');
      inputElement.value = this.getGrade(studentId, subjectId, type);
      return;
    }

    let grade = this.grades.find(g =>
      g.student_session.student.id === studentId &&
      g.assignement?.subject?.id === subjectId &&
      g.type === type
    );

    if (grade) {
      grade.mark = mark;
    } else {
      const student = this.students.find(s => s.id === studentId);
      if (!student) {
        console.warn('Student not found for ID:', studentId);
        return;
      }


      let assignment = this.grades.find(g =>
        g.assignement?.subject?.id === subjectId &&
        g.assignement?.class_model_id === this.classId
      )?.assignement;


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

  showStudentInfo(student: Student) {
    // You might need to adjust StudentDetailsModalComponent to accept Student instead of StudentSession
    // Or fetch StudentSession here if needed for the modal
    this.dialog.open(StudentDetailsModalComponent, {
      data: student,
      panelClass: 'custom-dialog-container' // Optional: for custom styling
    });
  }
}
