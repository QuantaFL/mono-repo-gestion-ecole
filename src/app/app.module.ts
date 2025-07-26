import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentListComponent } from './features/students/components/student-list/student-list.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { DashboardHomeComponent } from './features/dashboard/components/dashboard-home/dashboard-home.component';
import { TeacherListComponent } from './features/teachers/components/teacher-list/teacher-list.component';
import { SubjectListComponent } from './features/subjects/components/subject-list/subject-list.component';
import { GradeEntryComponent } from './features/grades/components/grade-entry/grade-entry.component';
import {ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './features/auth/components/register/register.component';
import { AddStudentComponent } from './features/students/components/add-student/add-student.component';
import { AddTeacherComponent } from './features/teachers/components/add-teacher/add-teacher.component';
import {ClassAddComponent} from "./features/class/components/class-add/class-add.component";
import {ClassListComponent} from "./features/class/components/class-list/class-list.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { AddSubjectComponent } from './features/subjects/components/add-subject/add-subject.component';
import { ChangePasswordComponent } from './features/auth/components/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    LoginComponent,
    DashboardHomeComponent,
    TeacherListComponent,
    SubjectListComponent,
    GradeEntryComponent,
    RegisterComponent,
    AddStudentComponent,
    AddTeacherComponent,
    ClassAddComponent,
    ClassListComponent,
    SidebarComponent,
    HeaderComponent,
    AddSubjectComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
