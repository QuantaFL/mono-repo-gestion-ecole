import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss'
})
export class SubjectListComponent implements OnInit {
  subjects: Subject[] = [];
  loading = false;
  error: string | null = null;

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.loading = true;
    this.subjectService.getAllSubject().subscribe({
      next: (res) => {
        console.log(res);
        // Flatten nested array if needed
        if (Array.isArray(res) && Array.isArray(res[0])) {
          this.subjects = res[0];
        } else if (Array.isArray(res)) {
          this.subjects = res;
        } else if (res) {
          this.subjects = [res];
        } else {
          this.subjects = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des matières';
        this.loading = false;
      }
    });
  }
}
