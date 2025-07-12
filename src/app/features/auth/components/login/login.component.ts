import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {LoginRequest} from "../../models/loginRequest";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = "";

  constructor(private router:Router,private authService:AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulaire soumis', this.loginForm.value);
        const { email, password } = this.loginForm.value;
        const loginRequest:LoginRequest = {
          email,
          password,
        }
      //   this.authService.login(loginRequest).subscribe({
      //     next: (response: any) => {
      //       localStorage.setItem('token', response.token);
      //       console.log(localStorage.getItem("token"));// stockage du token
      //       this.router.navigate(['/dashboard']);
      //     },
      //     error: (err) => {
      //       this.errorMessage = 'Identifiants incorrects';
      //     }
      //   });
       this.router.navigate(['/dashboard']);
    } else {
      console.log('Formulaire invalide');
    }
  }
}
