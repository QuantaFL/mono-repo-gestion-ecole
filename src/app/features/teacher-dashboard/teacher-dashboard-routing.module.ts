import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherDashboardLayoutComponent } from './components/teacher-dashboard-layout/teacher-dashboard-layout.component';
import { TeacherDashboardHomeComponent } from './components/teacher-dashboard-home/teacher-dashboard-home.component';
import { ClassDetailsComponent } from './components/class-details/class-details.component';
import { TeacherProfileComponent } from './components/teacher-profile/teacher-profile.component';


const routes: Routes = [
  { path: '', component: TeacherDashboardLayoutComponent, children: [
    { path: '', component: TeacherDashboardHomeComponent },
    { path: 'class-details/:id', component: ClassDetailsComponent },
    { path: 'profile', component: TeacherProfileComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherDashboardRoutingModule { }
