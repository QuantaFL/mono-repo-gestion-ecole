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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardHomeComponent,},
  { path: 'list_student', component: StudentListComponent },
  { path: 'student', component: AddStudentComponent },
  { path: 'teacher', component: AddTeacherComponent },
  { path: 'list_teacher', component: TeacherListComponent},
  { path: 'list_class', component: ClassListComponent},
  { path: 'class', component: ClassAddComponent},
  { path: 'list_subject', component: SubjectListComponent},
  // Assuming you meant to use AddSubjectComponent here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
