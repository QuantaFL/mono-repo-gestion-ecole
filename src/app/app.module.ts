import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { StudentListComponent } from './features/students/components/student-list/student-list.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { DashboardHomeComponent } from './features/dashboard/components/dashboard-home/dashboard-home.component';
import { TeacherListComponent } from './features/teachers/components/teacher-list/teacher-list.component';
import { SubjectListComponent } from './features/subjects/components/subject-list/subject-list.component';
import { GradeEntryComponent } from './features/grades/components/grade-entry/grade-entry.component';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RegisterComponent } from './features/auth/components/register/register.component';
import { AddStudentComponent } from './features/students/components/add-student/add-student.component';
import { AddTeacherComponent } from './features/teachers/components/add-teacher/add-teacher.component';
import { ClassAddComponent } from "./features/class/components/class-add/class-add.component";
import { ClassListComponent } from "./features/class/components/class-list/class-list.component";
import { HttpClientModule } from "@angular/common/http";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderComponent } from './components/header/header.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { AddSubjectComponent } from './features/subjects/components/add-subject/add-subject.component';
import { ChangePasswordComponent } from "./features/auth/components/change-password/change-password.component";
import { SharedModule } from './shared/shared.module';

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
    HeaderComponent,
    AddSubjectComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatTabsModule,
    SharedModule
  ],
  providers: [
    provideAnimationsAsync(),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }