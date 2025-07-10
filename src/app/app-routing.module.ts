import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./features/auth/components/login/login.component";
import {DashboardHomeComponent} from "./features/dashboard/components/dashboard-home/dashboard-home.component";
import {StudentListComponent} from "./features/students/components/student-list/student-list.component";
import {AddStudentComponent} from "./features/students/components/add-student/add-student.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardHomeComponent },
  { path: 'list_student', component: StudentListComponent },
  { path: 'student', component: AddStudentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
