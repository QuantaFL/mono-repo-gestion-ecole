import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../../services/subject.service';
import { Subject } from '../../models/subject';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss'
})
export class SubjectListComponent implements OnInit {
toggleSubjectStatus(subject: Subject) {
  console.log('Toggling status for subject:', subject);
  
  this.subjectService.toggleSubjectStatus(subject.name).subscribe({
    next: (response) => {
      console.log('Subject status toggled successfully:', response);
      
      // Update the local subject status
      const index = this.subjects.findIndex(s => s.name === subject.name);
      if (index !== -1) {
        this.subjects[index] = response;
      }
      
      const statusText = response.status ? 'activée' : 'désactivée';
      this.toastr.success(`Matière "${subject.name}" ${statusText} avec succès`, 'Succès');
    },
    error: (error) => {
      console.error('Error toggling subject status:', error);
      this.toastr.error('Erreur lors du changement de statut de la matière', 'Erreur');
    }
  });
}
  subjects: Subject[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private subjectService: SubjectService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchSubjects();
  }

  fetchSubjects(): void {
    this.loading = true;
    this.subjectService.getAllSubject().subscribe({
      next: (res) => {
        console.log(res.reverse());
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
