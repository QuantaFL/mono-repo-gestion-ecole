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
import {Teacher} from "../../models/teacher";


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
  uniqueSubjectIds: number[] = []; // Changed to number[] for subject IDs
  gradeTypes: string[] = ['devoir', 'examen'];
  assignements: Assignment[] = [];
  currentTeacher : Teacher | null = null;
  // Always show these types
  loading: boolean = false;
  errorMessage: string = '';
  gradeInputs: { [key: string]: number | null } = {};
  uniqueSubjects: Subject[] = [];
  subjectIdToSubject: { [id: number]: Subject } = {};

  constructor(
    private route: ActivatedRoute,
    private teacherDashboardService: TeacherDashboardService,
    private dialog: Dialog,
    private teacherStore: TeacherStore,
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
        const studentIds = (currentClass.current_academic_year_student_sessions || []).map((session: StudentSession) => session.student_id);
        if (studentIds.length > 0) {
          this.teacherDashboardService.fetchStudentsByIds(studentIds).subscribe({
            next: (students) => {
              this.students = students;
              this.fetchTeacherAssignmentsAndGrades();
              console.log('Class details and students fetched successfully:', this.currentClass, this.students);
            },
            error: (err) => {
              this.students = [];
              console.error('Error fetching students by IDs:', err);
            }
          });
        } else {
          this.students = [];
        }
      },
      error: (err: any) => {
        console.error('Error fetching class details or students:', err);
      }
    });
  }

  /**
   * Fetch assignments for this class, then grades. Ensures uniqueSubjects is always set.
   */
  fetchTeacherAssignmentsAndGrades(): void {
    if (!this.classId) return;
    this.teacherStore.currentTeacher$.subscribe(teacher => {
      if (!teacher) return;
      this.teacherDashboardService.getAssignmentsForTeacher(teacher.id).subscribe({
        next: (assignments) => {
          console.log('All assignments:', assignments); // Debug: log all assignments before filtering
          this.assignements = assignments.filter(a => a.class_model_id === this.classId);
          this.uniqueSubjectIds = this.assignements.map(a => a.subject_id).filter((id): id is number => !!id);
          this.gradeTypes = ['devoir', 'examen'];
          // Fetch all subjects in bulk
          if (this.uniqueSubjectIds.length > 0) {
            this.teacherDashboardService.fetchSubjectsByIds(this.uniqueSubjectIds).subscribe({
              next: (subjects: Subject[]) => {
                this.uniqueSubjects = subjects;
                this.subjectIdToSubject = {};
                for (const subj of subjects) {
                  this.subjectIdToSubject[subj.id] = subj;
                }
                this.fetchGradesForAllStudents();
              },
              error: (err) => {
                this.uniqueSubjects = [];
                this.subjectIdToSubject = {};
                this.fetchGradesForAllStudents();
                console.error('Error fetching subjects:', err);
              }
            });
          } else {
            this.uniqueSubjects = [];
            this.subjectIdToSubject = {};
            this.fetchGradesForAllStudents();
          }
        },
        error: (err) => {
          this.assignements = [];
          this.uniqueSubjectIds = [];
          this.uniqueSubjects = [];
          this.subjectIdToSubject = {};
          this.gradeTypes = ['devoir', 'examen'];
          console.error('Error fetching assignments:', err);
        }
      });
    });
  }

  fetchGradesForAllStudents(): void {
    if (!this.classId || !this.currentTerm || this.students.length === 0) return;

    const gradeObservables = this.students.filter(student => student && student.id).map(student =>
      this.teacherDashboardService.getGradesForStudentInClassTerm(this.classId!, this.currentTerm!.id, student!.id!)
    );
    console.log('Fetching grades for students:', this.students.map(s => s.id));

    forkJoin(gradeObservables).subscribe({
      next: (allStudentGrades: Grade[][]) => {
        this.grades = allStudentGrades.flat();
        console.log('Grades fetched successfully:', this.grades);
        // Initialize gradeInputs for all (student_session_id, assignment_id, type) combinations
        this.gradeInputs = {};
        for (const student of this.students) {
          const sessionId = student.latest_student_session?.id;
          if (!sessionId) {
            console.warn('Student missing sessionId:', student);
            continue;
          }
          for (const assignment of this.assignements) {
            for (const type of this.gradeTypes) {
              const key = `${sessionId}_${assignment.id}_${type}`;
              const grade = this.grades.find(g =>
                g.student_session?.id === sessionId &&
                g.assignement?.id === assignment.id &&
                g.type === type
              );
              this.gradeInputs[key] = grade ? grade.mark : null;
            }
          }
        }
        // Log for debugging
        console.log('gradeInputs:', this.gradeInputs);
        console.log('assignements:', this.assignements);
        console.log('gradeTypes:', this.gradeTypes);
        console.log('students:', this.students);
      },
      error: (err: any) => {
        console.error('Error fetching grades for students:', err);
      }
    });
  }

  getGrade(studentSessionId: number, assignmentId: number, type: string): number | null {
    const key = `${studentSessionId}_${assignmentId}_${type}`;
    if (this.gradeInputs.hasOwnProperty(key)) {
      return this.gradeInputs[key];
    }
    const grade = this.grades.find(g =>
      g.student_session?.id === studentSessionId &&
      g.assignement?.id === assignmentId &&
      g.type === type
    );
    return grade ? grade.mark : null;
  }

  updateGrades(studentId: number, subjectId: number, type: string, event: any): void {
    const value = event.target.value === '' ? null : Number(event.target.value);
    const key = `${studentId}_${subjectId}_${type}`;
    this.gradeInputs[key] = value;
  }

  saveGrades(): void {
    if (!this.currentTerm) return;
    this.loading = true;
    this.errorMessage = '';
    const requests = [];
    for (const student of this.students) {
      for (const subjectId of this.uniqueSubjectIds) {
        for (const type of this.gradeTypes) {
          const key = `${student.id}_${subjectId}_${type}`;
          const mark = this.gradeInputs[key];
          if (mark === null || mark === undefined || isNaN(mark)) continue;
          const existingGrade = this.grades.find(g =>
            g.student_session?.student?.id === student.id &&
            g.assignement?.subject?.id === subjectId &&
            g.type === type
          );
          const assignement = this.assignements.find(a => a.subject_id === subjectId && a.class_model_id === this.classId);
          if (!assignement) continue;
          const payload = {
            assignement_id: assignement.id,
            student_session_id: student.latest_student_session?.id,
            term_id: this.currentTerm.id,
            type,
            mark
          };
          if (existingGrade && existingGrade.id != null) {
            // updateGrade should accept (id, payload)
            requests.push(this.teacherDashboardService.updateGrade(existingGrade.id as number, payload));
          } else {
            // Use the correct method for creating a grade
            requests.push(this.teacherDashboardService.addGrade(payload));
          }
        }
      }
    }
    if (requests.length === 0) {
      this.loading = false;
      return;
    }
    Promise.all(requests.map(r => r.toPromise()))
      .then(() => {
        this.fetchGradesForAllStudents();
        this.loading = false;
      })
      .catch(err => {
        this.errorMessage = 'Erreur lors de l\'enregistrement des notes.';
        this.loading = false;
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
