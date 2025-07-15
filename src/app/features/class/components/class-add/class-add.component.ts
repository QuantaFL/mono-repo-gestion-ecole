import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ClassService } from '../../services/class.service';

@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.scss']
})
export class ClassAddComponent {
  classForm = new FormGroup({
    name: new FormControl('', Validators.required),
    academic_year: new FormControl('', Validators.required)
  });

  success: string | null = null;
  error: string | null = null;

  constructor(private classService: ClassService) {}

  onSubmit(): void {
    this.success = null;
    this.error = null;
    if (this.classForm.valid) {
      const newClass = this.classForm.value;
      console.log(newClass);
      this.classService.create({
        name: newClass.name!,
        academicYear: newClass.academic_year!
      }).subscribe({
        next: (res) => {
          this.success = 'Classe ajoutée avec succès';
          this.classForm.reset();
        },
        error: (err) => {
          this.error = 'Erreur lors de l\'ajout de la classe';
        }
      });
    }
  }
}
