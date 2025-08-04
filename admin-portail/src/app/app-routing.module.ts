import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./features/auth/components/login/login.component";
import {DashboardHomeComponent} from "./features/dashboard/components/dashboard-home/dashboard-home.component";
import {StudentListComponent} from "./features/students/components/student-list/student-list.component";
import {AddStudentComponent} from "./features/students/components/add-student/add-student.component";
import {TeacherListComponent} from "./features/teachers/components/teacher-list/teacher-list.component";
import {AddTeacherComponent} from "./features/teachers/components/add-teacher/add-teacher.component";
import {ClassAddComponent} from "./features/class/components/class-add/class-add.component";
import {ClassListComponent} from "./features/class/components/class-list/class-list.component";
import {authGuard} from "./core/guards/auth.guard";
import {SubjectListComponent} from "./features/subjects/components/subject-list/subject-list.component";
import {AddSubjectComponent} from "./features/subjects/components/add-subject/add-subject.component";
import {ChangePasswordComponent} from "./features/auth/components/change-password/change-password.component";
import { TerminatedTeacherListComponent } from './features/teachers/components/terminated-teacher-list/terminated-teacher-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardHomeComponent,canActivate: [authGuard]},
  { path: 'list_student', component: StudentListComponent,canActivate: [authGuard] },
  { path: 'student', component: AddStudentComponent,canActivate: [authGuard] },
  { path: 'teacher', component: AddTeacherComponent,canActivate: [authGuard] },
  { path: 'list_teacher', component: TeacherListComponent,canActivate: [authGuard]},
  { path: 'list_class', component: ClassListComponent,canActivate: [authGuard]},
  { path: 'class', component: ClassAddComponent,canActivate: [authGuard]},
  { path: 'list_subject', component: SubjectListComponent},
  {path: 'subject', component: AddSubjectComponent},
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [authGuard] },
  { path: 'teacher-dashboard', loadChildren: () => import('./features/teacher-dashboard/teacher-dashboard.module').then(m => m.TeacherDashboardModule) },
  {path:'list_terminated_assigned_teacher', component: TerminatedTeacherListComponent, canActivate: [authGuard]},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
