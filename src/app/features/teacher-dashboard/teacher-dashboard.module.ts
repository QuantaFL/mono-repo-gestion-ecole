import { NgModule } from '@angular/core';
import {CommonModule, DatePipe, TitleCasePipe} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from '@angular/cdk/dialog';

import { TeacherDashboardRoutingModule } from './teacher-dashboard-routing.module';
import { TeacherDashboardHomeComponent } from './components/teacher-dashboard-home/teacher-dashboard-home.component';
import { TeacherDashboardLayoutComponent } from './components/teacher-dashboard-layout/teacher-dashboard-layout.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
// import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';
import { StudentDetailsModalComponent } from './components/student-details-modal/student-details-modal.component';
import { TeacherMyClassesComponent } from './components/teacher-my-classes/teacher-my-classes.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    TeacherDashboardHomeComponent,
    ClassDetailsComponent,
    TeacherDashboardLayoutComponent,
    StudentDetailsModalComponent,
    TeacherMyClassesComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeacherDashboardRoutingModule,
    HttpClientModule,
    DialogModule,
    SharedModule,
    ReactiveFormsModule
  ],
})
export class TeacherDashboardModule { }
