import {Component, OnInit} from '@angular/core';
import {Teacher} from "../../models/teacher";
import {TeacherService} from "../../services/teacher.service";
import {AssignmentService} from "../../services/assignment.service";
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  loading = false;
  error: string | null = null;
  
  // Modal properties
  isTerminationModalOpen = false;
  selectedTeacher: Teacher | null = null;

  constructor(
    private teacherService: TeacherService,
    private assignmentService: AssignmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchTeachers();
  }

  fetchTeachers(): void {
    this.loading = true;
    this.teacherService.getAllTeacher().subscribe({
      next: (res) => {
        console.log(res);
        // Filtrer pour n'afficher que les enseignants actifs (contrats à true)
        this.teachers = res.filter(teacher => teacher.isActive !== false).reverse();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des enseignants';
        this.loading = false;
      }
    });
  }

  openTerminationModal(teacher: Teacher): void {
    console.log('Opening termination modal for teacher:', teacher);
    this.selectedTeacher = teacher;
    this.isTerminationModalOpen = true;
  }

  closeTerminationModal(): void {
    console.log('Closing termination modal');
    this.isTerminationModalOpen = false;
    this.selectedTeacher = null;
  }

  confirmTermination(teacher: Teacher): void {
    console.log('Confirming termination for teacher:', teacher);
    
    this.assignmentService.toggleAssignmentStatusByTeacher(teacher.id).subscribe({
      next: (response) => {
        console.log('Assignment status toggled successfully:', response);
        
        const teacherName = `${teacher.userModel.first_name} ${teacher.userModel.last_name}`;
        if (response.isActive) {
          this.toastr.success(`Contrat de ${teacherName} réactivé avec succès`, 'Succès');
        } else {
          this.toastr.success(`Contrat de ${teacherName} résilié avec succès`, 'Succès');
        }
        
        // Refresh the teacher list to remove terminated teachers
        this.fetchTeachers();
        this.closeTerminationModal();
      },
      error: (error) => {
        console.error('Error toggling assignment status:', error);
        this.toastr.error('Erreur lors de la résiliation du contrat', 'Erreur');
      }
    });
  }
}
