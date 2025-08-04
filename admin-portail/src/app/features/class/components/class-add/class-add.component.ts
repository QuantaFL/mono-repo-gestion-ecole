import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ClassService } from '../../services/class.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassModel } from '../../../teacher-dashboard/models/class-model';


@Component({
  selector: 'app-class-add',
  templateUrl: './class-add.component.html',
  styleUrls: ['./class-add.component.scss']
})
export class ClassAddComponent implements OnInit {
  classForm = new FormGroup({
    name: new FormControl('', Validators.required),
    level: new FormControl('', Validators.required)
  });

  success: string | null = null;
  error: string | null = null;
  isEdit = false;
  classId: number | null = null;

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.classId) {
      this.isEdit = true;
      this.classService.getById(this.classId).subscribe({
        next: (res) => {
          this.classForm.patchValue({
            name: res.name,
            level: res.level
          });
        },
        error: () => {
          this.error = 'Erreur lors du chargement de la classe.';
        }
      });
    }
  }
  onSubmit(): void {
    this.success = null;
    this.error = null;
    if (this.classForm.valid) {
      const formValue = this.classForm.value;
      if (this.isEdit && this.classId) {
        this.classService.update(this.classId, {
          name: formValue.name!,
          level: formValue.level!
        }).subscribe({
          next: () => {
            this.success = 'Classe modifiée avec succès';
            this.router.navigate(['/class/list']);
          },
          error: () => {
            this.error = 'Erreur lors de la modification de la classe';
          }
        });
      } else {
            const classModel: ClassModel = {
              name: formValue.name!,
              level: formValue.level!,
              // id: 0,
              latest_student_session: null,
              current_academic_year_student_sessions: []
            };
     
        this.classService.create(
          classModel
        ).subscribe({
          next: () => {
            this.success = 'Classe ajoutée avec succès';
            this.classForm.reset();
            this.router.navigateByUrl('/list_class');
            console.log('Classe ajoutée avec succès');
          },
          error: () => {
            this.error = 'Erreur lors de l\'ajout de la classe';
          }
        });
      }
    }
  }
  onReset(): void {
    this.classForm.reset();
    this.success = null;
    this.error = null;
  }

}
