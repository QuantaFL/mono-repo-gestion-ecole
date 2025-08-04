import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    this.changePasswordForm = new FormGroup({
      old_password: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      password_confirmation: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const formValue = this.changePasswordForm.value;
      this.authService.changePassword(formValue).subscribe({
        next: (res: any) => {
          this.successMessage = 'Mot de passe changé avec succès.';
          setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Erreur lors du changement de mot de passe.';
        }
      });
    }
  }
}
