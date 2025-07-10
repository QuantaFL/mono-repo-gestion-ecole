import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrl: './class-add.component.scss'
})
export class ClassAddComponent {
  classForm = new FormGroup({
    name: new FormControl('', Validators.required),
    academicYear: new FormControl('', Validators.required)
  });

  onSubmit(): void {
    if (this.classForm.valid) {
      const newClass = this.classForm.value;
      console.log('Classe ajoutée :', newClass);
      // À connecter plus tard avec le service
      this.classForm.reset();
    }
  }
}
