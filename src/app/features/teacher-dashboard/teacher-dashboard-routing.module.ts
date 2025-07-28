import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  TeacherDashboardLayoutComponent
} from './components/teacher-dashboard-layout/teacher-dashboard-layout.component';
import {TeacherDashboardHomeComponent} from './components/teacher-dashboard-home/teacher-dashboard-home.component';
import {ClassDetailsComponent} from './components/class-details/class-details.component';
import {TeacherMyClassesComponent} from "./components/teacher-my-classes/teacher-my-classes.component";
import {TeacherTimetableComponent} from './components/teacher-timetable/teacher-timetable.component';


const routes: Routes = [
  { path: '', component: TeacherDashboardLayoutComponent, children: [
    { path: '', component: TeacherDashboardHomeComponent },
    { path: 'class-details/:id', component: ClassDetailsComponent },
      {path: 'my-classes', component: TeacherMyClassesComponent},
      {path: 'timetable', component: TeacherTimetableComponent}
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherDashboardRoutingModule { }
