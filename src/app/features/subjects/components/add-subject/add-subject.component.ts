import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-subject',
  templateUrl: './add-subject.component.html',
  styleUrls: ['./add-subject.component.scss']
})
export class AddSubjectComponent {
  subjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private router: Router,
     private toast: ToastrService
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      const subjectData = this.subjectForm.value;
      this.subjectService.createSubject(subjectData).subscribe({
        next: (res) => {
          console.log(res);
          this.toast.success('matière enregistrée avec succes', 'Succès');

          // Optionally handle success, e.g. redirect or show a message
          this.router.navigate(['/list_subject']);
        },
        error: (err) => {
          // Optionally handle error
          const message = err.error?.message || 'Une erreur est survenue';
           this.toast.error(message, 'Erreur');
        
          console.error(err);
        }
      });
    }
  }

}
