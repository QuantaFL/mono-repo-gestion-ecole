import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { DialogModule } from '@angular/cdk/dialog';

import { TeacherDashboardRoutingModule } from './teacher-dashboard-routing.module';
import { TeacherDashboardHomeComponent } from './components/teacher-dashboard-home/teacher-dashboard-home.component';
import { TeacherDashboardLayoutComponent } from './components/teacher-dashboard-layout/teacher-dashboard-layout.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { TeacherDashboardSidebarComponent } from './components/teacher-dashboard-sidebar/teacher-dashboard-sidebar.component';
import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';
import { StudentDetailsModalComponent } from './components/student-details-modal/student-details-modal.component';




@NgModule({
  declarations: [
    TeacherDashboardHomeComponent,
    ClassDetailsComponent,
    TeacherDashboardLayoutComponent,
    TeacherDashboardSidebarComponent,
    TeacherProfileComponent,
    StudentDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TeacherDashboardRoutingModule,
    HttpClientModule,
    RouterModule, // Add RouterModule here
    DialogModule
    
  ]
})
export class TeacherDashboardModule { }