import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {LoginRequest} from "../../requests/loginRequest";
import {LoginResponse} from "../../requests/LoginResponse";
import { TeacherStore } from '../../../teacher-dashboard/services/teacher.store';
import { TeacherDashboardService } from '../../../teacher-dashboard/services/teacher-dashboard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = "";

  constructor(private router:Router,private authService:AuthService, private teacherStore: TeacherStore, private teacherDashboardService: TeacherDashboardService) {
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
            localStorage.setItem('user', JSON.stringify(response.user)); // Keep for getUserFromLocalStorage
            console.log(localStorage.getItem("token"));
            // if(response.user.isFirstLogin){
            //   await this.router.navigate(['/change-password']);
            //   return;
            // }
            if(response.user.role.name === 'teacher') {
              if (response.user.id) {
                this.teacherDashboardService.getTeacherByUserId(response.user.id).subscribe({
                  next: async (teacher) => {
                    this.teacherStore.setTeacher(teacher);
                    await this.router.navigate(['/teacher-dashboard']);
                  },
                  error: (err) => {
                    console.error('Error fetching teacher details:', err);
                    this.errorMessage = 'Failed to load teacher data.';
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    this.teacherStore.setTeacher(null);
                  }
                });
              } else {
                console.error('User ID is missing for teacher role.');
                this.errorMessage = 'User ID is missing.';
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.teacherStore.setTeacher(null);
              }
            } else if(response.user.role.name === 'admin') {
            await this.router.navigate(['/dashboard']);
            }else{
              console.log(response.user)
              console.log('Vous netes pas autorisé à accéder à cette application')
              this.errorMessage = 'Vous netes pas autorisé à accéder à cette application';
              //TODO navigate to unauthorized page as its either a student or parent
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              this.teacherStore.setTeacher(null);
            }
          },
          error: (err) => {
            this.errorMessage = 'Identifiants incorrects';
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            this.teacherStore.setTeacher(null);
          }
        });
    } else {
      console.log('Formulaire invalide');
    }
  }
}
