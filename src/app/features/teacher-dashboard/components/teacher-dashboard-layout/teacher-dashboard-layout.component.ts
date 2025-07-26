import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-dashboard-layout',
  templateUrl: './teacher-dashboard-layout.component.html',
  styleUrls: ['./teacher-dashboard-layout.component.scss']
})
export class TeacherDashboardLayoutComponent {
  isSidebarCollapsed = false;

  onSidebarCollapsedStateChanged(state: boolean) {
    this.isSidebarCollapsed = state;
  }
}
