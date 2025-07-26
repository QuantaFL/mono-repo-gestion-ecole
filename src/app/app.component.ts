import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isSidebarCollapsed = false;
  showSidebarAndHeader = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebarAndHeader = !event.urlAfterRedirects.includes('/login');
      }
    });
  }

  onSidebarCollapsedStateChanged(isCollapsed: boolean) {
    this.isSidebarCollapsed = isCollapsed;
  }
}
