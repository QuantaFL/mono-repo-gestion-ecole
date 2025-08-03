import { Component, OnInit } from '@angular/core';
import { ClassService } from '../../services/class.service';
import { ClassModel } from '../../../teacher-dashboard/models/class-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {
  
  constructor(
    private classService: ClassService,
    private router: Router
  ) {
    
  }
  
  classes: ClassModel[] = [];
  loading = false;
  error: string | null = null;
  
  // Modal properties
  isModalOpen = false;
  isViewSubjectsModalOpen = false;
  selectedClass: ClassModel | null = null;

  goToClass() {
    this.router.navigateByUrl('/class'); 
  }
  
  addSubject(classe: ClassModel) {
    console.log('Opening modal for class:', classe);
    this.selectedClass = classe;
    this.isModalOpen = true;
  }
  
  generateBulletin(_t21: ClassModel) {
    throw new Error('Method not implemented.');
  }
  
  viewSubjects(classe: ClassModel) {
    console.log('Opening subjects view for class:', classe);
    this.selectedClass = classe;
    this.isViewSubjectsModalOpen = true;
  }

  closeModal() {
    console.log('Closing modal');
    this.isModalOpen = false;
    this.selectedClass = null;
  }
  
  closeViewSubjectsModal() {
    console.log('Closing view subjects modal');
    this.isViewSubjectsModalOpen = false;
    this.selectedClass = null;
  }
  
  onSubjectAssigned(response: any) {
    console.log('Subject assigned successfully:', response);
    // Optionally refresh the class list or show a success message
    this.getAllClasses();
  }

 

  ngOnInit(): void {
        this.getAllClasses();

  }

  showInfo(classe: any): void {
    alert('Classe: ' + classe.name + '\nNiveau: ' + classe.level);
  }
    getAllClasses(): void {
    this.classService.getAll().subscribe({
      next: (classesResponse) => {
        console.log('Classes fetched successfully:',classesResponse);
        this.classes = classesResponse.reverse(); // Reverse to show the latest classes first
        this.classes = classesResponse;
      },
      error: () => {
        this.error = 'Erreur lors de la récupération des classes.';
      }
    });
  }
}
