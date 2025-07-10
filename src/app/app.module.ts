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

@NgModule({
  declarations: [
    AppComponent,
    StudentListComponent,
    LoginComponent,
    DashboardHomeComponent,
    TeacherListComponent,
    SubjectListComponent,
    GradeEntryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
