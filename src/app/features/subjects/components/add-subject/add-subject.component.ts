import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      coefficient: ['', [Validators.required, Validators.min(1)]],
      level: ['']
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      const subjectData = this.subjectForm.value;
      this.subjectService.createSubject(subjectData).subscribe({
        next: (res) => {
          console.log(res);
          // Optionally handle success, e.g. redirect or show a message
          this.router.navigate(['/subjects']);
        },
        error: (err) => {
          // Optionally handle error
          console.error(err);
        }
      });
    }
  }
}
