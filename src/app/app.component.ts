import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isSidebarCollapsed = false;

  onSidebarCollapsedStateChanged(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
