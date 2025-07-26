import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {LoginRequest} from "../../requests/loginRequest";
import {LoginResponse} from "../../requests/LoginResponse";

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
      this.authService.login(loginRequest).subscribe({
          next: async (response: LoginResponse) => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            console.log(localStorage.getItem("token"));
            if(response.user.role.name === 'teacher') {
              await this.router.navigate(['/teacher-dashboard']);
            } else if(response.user.role.name === 'admin') {
            await this.router.navigate(['/dashboard']);
            }else{
              console.log(response.user)
              console.log('Vous netes pas autorisé à accéder à cette application')
              this.errorMessage = 'Vous netes pas autorisé à accéder à cette application';
              //TODO navigate to unauthorized page as its either a student or parent
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          },
          error: (err) => {
            this.errorMessage = 'Identifiants incorrects';
          }
        });
    } else {
      console.log('Formulaire invalide');
    }
  }
}
