import { Component, OnInit } from '@angular/core';
import { ClassService } from '../../services/class.service';
import { ClassModel } from '../../models/class';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {
  classes: ClassModel[] = [];
  loading = false;
  error: string | null = null;

  constructor(private classService: ClassService) {}

  ngOnInit(): void {
    this.fetchClasses();
  }

  fetchClasses(): void {
    this.loading = true;
    this.classService.getAll().subscribe({
      next: (res) => {
        this.classes = res.classes || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des classes';
        this.loading = false;
      }
    });
  }

  deleteClass(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette classe ?')) return;
    this.classService.delete(id).subscribe({
      next: () => {
        this.classes = this.classes.filter(c => c.id !== id);
      },
      error: () => {
        this.error = 'Erreur lors de la suppression';
      }
    });
  }
}
