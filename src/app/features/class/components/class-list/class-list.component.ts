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
goToClass() {
   this.router.navigateByUrl('/class'); 
}
  addSubject(_t21: ClassModel) {
  throw new Error('Method not implemented.');
  }
  generateBulletin(_t21: ClassModel) {
  throw new Error('Method not implemented.');
  }

   classes: ClassModel[] = [];
  loading = false;
  error: string | null = null;

 

  ngOnInit(): void {
        this.getAllClasses();

  }

  showInfo(classe: any): void {
    alert('Classe: ' + classe.name + '\nNiveau: ' + classe.level);
  }
    getAllClasses(): void {
    this.classService.getAll().subscribe({
      next: (classesResponse) => {
        this.classes = classesResponse;
      },
      error: () => {
        this.error = 'Erreur lors de la récupération des classes.';
      }
    });
  }
}
