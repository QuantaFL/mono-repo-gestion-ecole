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
import { StudentNote } from '../../models/student-note';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-class-details',
  templateUrl: './class-details.component.html',
  styleUrl: './class-details.component.scss'
})
export class ClassDetailsComponent implements OnInit {
  studentNotes: StudentNote[] = [];
  // Map: assignmentId -> StudentNote[]
  assignmentNotesMap: { [assignmentId: number]: StudentNote[] } = {};
  /**
   * Fetch notes for all assignments of all subjects the teacher teaches in this class.
   * Populates assignmentNotesMap for quick access.
   */
  fetchAllAssignmentNotes(): void {
    if (!this.classId || !this.currentTeacher || this.assignements.length === 0) {
      console.warn('[DEBUG] fetchAllAssignmentNotes early return:', {
        classId: this.classId,
        currentTeacher: this.currentTeacher,
        assignementsLength: this.assignements.length
      });
      return;
    }
    // Use teacher.teacher_id if present, else teacher.id
    const teacherId = (this.currentTeacher as any).teacher_id || this.currentTeacher.id;
    console.log('[DEBUG] fetchAllAssignmentNotes using teacherId:', teacherId);
    const requests = [];
    for (const assignment of this.assignements) {
      if (!assignment.subject_id) continue;
      console.log('[DEBUG] Fetching notes for assignment:', assignment.id, 'subject:', assignment.subject_id, 'teacher:', this.currentTeacher.id);
      requests.push(
        this.teacherDashboardService.getTeacherClassAssignmentsNotes(
          teacherId,
          this.classId,
          assignment.subject_id,
          assignment.id
        )
          .pipe()
      );
    }
    if (requests.length === 0) return;
    // Use forkJoin to fetch all notes in parallel
    forkJoin(requests).subscribe({
      next: (allNotes: StudentNote[][]) => {
        this.assignmentNotesMap = {};
        for (let i = 0; i < this.assignements.length; i++) {
          const assignment = this.assignements[i];
          if (!assignment.subject_id) continue;
          this.assignmentNotesMap[assignment.id] = allNotes[i] || [];
        }
        // Set studentNotes and grades for the first assignment (if any)
        const firstAssignment = this.assignements[0];
        if (firstAssignment) {
          this.studentNotes = this.assignmentNotesMap[firstAssignment.id] || [];
          // Flatten grades for this assignment for UI use
          this.grades = [];
          const notes = this.assignmentNotesMap[firstAssignment.id] || [];
          console.log('[DEBUG] Notes for first assignment:', notes);
          for (const note of notes) {
            // Find the full student session object
            const studentSession = this.students
              .map(s => s.latest_student_session)
              .find(ss => ss && ss.id === note.student_session_id);
            console.log('[DEBUG] Processing note:', note, 'Found studentSession:', studentSession);
            for (const grade of note.grades) {
              console.log('[DEBUG] Adding grade:', grade, 'for studentSession:', studentSession, 'assignment:', firstAssignment);
              this.grades.push({
                ...grade,
                student_session: studentSession || { id: note.student_session_id },
                assignement: firstAssignment,
              });
            }
          }
          console.log('[DEBUG] Final grades array:', this.grades);
        }
        // Pre-fill gradeInputs for all assignments
        for (const assignment of this.assignements) {
          const notes = this.assignmentNotesMap[assignment.id] || [];
          for (const note of notes) {
            const sessionId = note.student_session_id;
            for (const grade of note.grades) {
              const key = `${sessionId}_${assignment.id}_${grade.type}`;
              this.gradeInputs[key] = grade.mark;
            }
          }
        }
        console.log('Fetched all assignment notes:', this.assignmentNotesMap);
      },
      error: (err) => {
        this.assignmentNotesMap = {};
        console.error('Error fetching all assignment notes:', err);
      }
    });
  }
  /**
   * Fetch student notes for a specific assignment in this class, subject, and teacher.
   */
  fetchStudentNotesForAssignment(subjectId: number, assignmentId: number): void {
    if (!this.classId || !subjectId || !assignmentId || !this.currentTeacher) return;
    // Use teacher.teacher_id if present, else teacher.id
    const teacherId = (this.currentTeacher as any).teacher_id || this.currentTeacher.id;
    console.log('[DEBUG] fetchStudentNotesForAssignment using teacherId:', teacherId);
    this.teacherDashboardService.getTeacherClassAssignmentsNotes(
      teacherId,
      this.classId,
      subjectId,
      assignmentId
    ).subscribe({
      next: (notes: StudentNote[]) => {
        this.studentNotes = notes;
        // Flatten grades for this assignment for UI use
        this.grades = [];
        // Find the assignment object
        const assignmentObj = this.assignements.find(a => a.id === assignmentId);
        console.log('[DEBUG] Notes for assignment', assignmentId, ':', notes);
        for (const note of notes) {
          // Find the full student session object
          const studentSession = this.students
            .map(s => s.latest_student_session)
            .find(ss => ss && ss.id === note.student_session_id);
          console.log('[DEBUG] Processing note:', note, 'Found studentSession:', studentSession);
          for (const grade of note.grades) {
            console.log('[DEBUG] Adding grade:', grade, 'for studentSession:', studentSession, 'assignment:', assignmentObj);
            this.grades.push({
              ...grade,
              student_session: studentSession || { id: note.student_session_id },
              assignement: assignmentObj || { id: assignmentId },
            });
            const key = `${note.student_session_id}_${assignmentId}_${grade.type}`;
            this.gradeInputs[key] = grade.mark;
          }
        }
        console.log('[DEBUG] Final grades array:', this.grades);
        console.log('Fetched student notes for assignment:', notes);
      },
      error: (err) => {
        this.studentNotes = [];
        this.grades = [];
        console.error('Error fetching student notes for assignment:', err);
      }
    });
  }
  classId: number | null = null;
  currentClass: ClassModel | null = null;
  currentTerm: Term | null = null;
  grades: any[] = [];
  students: Student[] = [];
  uniqueSubjectIds: number[] = []; // Changed to number[] for subject IDs
  gradeTypes: string[] = ['exam', 'quiz'];
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
    private toast: ToastrService
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
      currentClass: this.teacherDashboardService.getClassById(this.classId),
    }).subscribe({
      next: ({ currentTerm, currentClass }) => {

      console.log('Fetching class details for classId:', this.classId)
        this.currentTerm = currentTerm;
        this.currentClass = currentClass;
        console.log('currentClass:', currentClass);
        const studentIds = (currentClass.current_academic_year_student_sessions).map((session: StudentSession) => session.student_id);
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
      this.currentTeacher = teacher; // Ensure currentTeacher is set before any logic
      // Use teacher.teacher_id if present, else teacher.id
      const teacherId = (teacher as any).teacher_id || teacher.id;
      console.log('[DEBUG] Current teacher object:', teacher, 'Using teacherId:', teacherId);
      this.teacherDashboardService.getAssignmentsForTeacher(teacherId).subscribe({
        next: (assignments) => {
          console.log('All assignments:', assignments); // Debug: log all assignments before filtering
          // Filter assignments strictly for the current class
          const filteredAssignments = assignments.filter(a => a.class_model_id === this.classId);
          console.log('Filtered assignments for current class:', filteredAssignments);
          this.assignements = filteredAssignments;
          this.uniqueSubjectIds = this.assignements.map(a => a.subject?.id).filter((id): id is number => !!id);
          this.gradeTypes = ['quiz', 'exam'];
          // Fetch all subjects in bulk
          if (this.uniqueSubjectIds.length > 0) {
            this.teacherDashboardService.fetchSubjectsByIds(this.uniqueSubjectIds).subscribe({
              next: (subjects: Subject[]) => {
                this.uniqueSubjects = subjects;
                this.subjectIdToSubject = {};
                for (const subj of subjects) {
                  this.subjectIdToSubject[subj.id] = subj;
                }
                // Automatically fetch all assignment notes for this teacher/class
                if (subjects.length > 0 && this.assignements.length > 0) {
                  this.fetchAllAssignmentNotes();
                  // Do NOT call fetchGradesForAllStudents here, to avoid overwriting gradeInputs
                } else {
                  this.fetchGradesForAllStudents();
                }
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
          this.gradeTypes = ['quiz', 'exam'];
          console.error('Error fetching assignments:', err);
        }
      });
    });
  }

  /**
   * Fetch all grades for all students in the class, using the new batch endpoint and passing all available context.
   */
  fetchGradesForAllStudents(): void {
    if (!this.classId || !this.currentTerm || this.students.length === 0) return;

    let teacherId: number | undefined;
    if (this.currentTeacher && this.currentTeacher.id) {
      teacherId = this.currentTeacher.id;
    }
    this.teacherDashboardService.getAllGradesForClass(
      this.classId,
      teacherId
    ).subscribe({
      next: (response: any[]) => {
        // Flatten grades from backend response
        const flatGrades: any[] = [];
        for (const entry of response) {
          // If grades is an error, log assignment and student session IDs
          if (entry.grades && entry.grades.error) {
            // Try to get assignmentId from entry, but fallback to undefined
            const sessionId = entry.student_session?.id || 'unknown';
            // assignmentId is not present in entry, so log only sessionId here
            console.warn(`Assignment not found for Student Session ID: ${sessionId}. Assignment ID not present in backend response.`);
            continue;
          }
          // If grades is an array, flatten each
          if (Array.isArray(entry.grades)) {
            for (const grade of entry.grades) {
              flatGrades.push({
                ...grade,
                student: entry.student,
                student_session: entry.student_session
              });
            }
          }
        }
        this.grades = flatGrades;
        console.log('Flattened grades:', this.grades);
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
              const grade = this.grades.find(g => {
                const match = g.student_session?.id === sessionId &&
                  g.assignement?.id === assignment.id &&
                  g.type === type;
                if (match) {
                  console.log('Grade matched:', {
                    sessionId,
                    assignmentId: assignment.id,
                    type,
                    grade
                  });
                }
                return match;
              });
              if (!grade) {
                // Log assignment not found with assignmentId from loop
                console.warn(`Assignment not found. Assignment ID: ${assignment.id}, Student Session ID: ${sessionId}`);
              }
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
        console.error('Error fetching grades for class:', err);
      }
    });
  }

  getGrade(studentSessionId: number, assignmentId: number, type: string): number | null {
    const key = `${studentSessionId}_${assignmentId}_${type}`;
    if (this.gradeInputs.hasOwnProperty(key)) {
      const value = this.gradeInputs[key];
      if (value === null) {
       } else {
        console.log('getGrade: Found grade for', { studentSessionId, assignmentId, type, value });
      }
      return value;
    }
    const grade = this.grades.find(g => {
      const match = g.student_session?.id === studentSessionId &&
        g.assignement?.id === assignmentId &&
        g.type === type;
      if (match) {
        console.log('getGrade: Matched grade object', { studentSessionId, assignmentId, type, grade });
      }
      return match;
    });
    // Removed 'getGrade: No grade found for' log as requested
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
    const gradesBatch: any[] = [];
    for (const student of this.students) {
      const sessionId = student.latest_student_session?.id;
      if (!sessionId) continue;
      for (const assignment of this.assignements) {
        for (const type of this.gradeTypes) {
          const key = `${sessionId}_${assignment.id}_${type}`;
          const mark = this.gradeInputs[key];
          if (mark === null || mark === undefined || isNaN(mark)) continue;
          gradesBatch.push({
            student_session_id: sessionId,
            assignement_id: assignment.id,
            type,
            mark
          });
        }
      }
    }
    if (gradesBatch.length === 0) {
      this.loading = false;
      return;
    }
    console.log('Saving grades batch:', gradesBatch);
    this.teacherDashboardService.addGradesBatch(gradesBatch).subscribe({
      next: () => {
        // After saving, refresh student notes for the first assignment of the first subject
        if (this.uniqueSubjects.length > 0 && this.assignements.length > 0) {
          const firstSubject = this.uniqueSubjects[0];
          const firstAssignment = this.assignements.find(a => a.subject_id === firstSubject.id);
          if (firstAssignment) {
            this.fetchStudentNotesForAssignment(firstSubject.id, firstAssignment.id);
          }
        }
        this.loading = false;
        this.toast.success('Notes enregistrées avec succès !', 'Succès');
      },
      error: (err: any) => {
        this.errorMessage = 'Erreur lors de l\'enregistrement des notes.';
        this.loading = false;
        this.toast.error(this.errorMessage, 'Erreur');
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
          // After submitting, refresh student notes for the first assignment of the first subject
          if (this.uniqueSubjects.length > 0 && this.assignements.length > 0) {
            const firstSubject = this.uniqueSubjects[0];
            const firstAssignment = this.assignements.find(a => a.subject_id === firstSubject.id);
            if (firstAssignment) {
              this.fetchStudentNotesForAssignment(firstSubject.id, firstAssignment.id);
            }
          }
          this.toast.success('Notes du terme soumises avec succès !', 'Succès');
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la soumission des notes du terme:', err);
          this.errorMessage = 'Erreur lors de la soumission des notes du terme.';
          this.loading = false;
          this.toast.error('Erreur lors de la soumission des notes du terme. Veuillez vérifier la console pour plus de détails.', 'Erreur');
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
