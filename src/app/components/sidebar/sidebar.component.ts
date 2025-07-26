import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

interface MenuItem {
  label: string;
  path: string;
  icon: string | SafeHtml;
  isActive: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  isMobile = false;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 018.25 18H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />',
      isActive: false
    },
    {
      label: 'Tableau de bord Enseignant',
      path: '/teacher-dashboard',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0a8.967 8.967 0 00-6 2.292m6-2.292v14.25" />',
      isActive: false
    },
    {
      label: 'Élèves',
      path: '/list_student',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.12-.318.239-.636.354-.961M14.023 9.348a3.75 3.75 0 01-4.997 0 3.75 3.75 0 01-4.996-4.997 3.75 3.75 0 014.997 0 3.75 3.75 0 014.996 4.997z" />',
      isActive: false
    },
    {
      label: 'Enseignants',
      path: '/list_teacher',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25v-4.07m18-4.22l-2.28-2.28a2.25 2.25 0 00-3.182 0l-2.28 2.28a2.25 2.25 0 01-3.182 0l-2.28-2.28a2.25 2.25 0 00-3.182 0l-2.28 2.28m18 4.22V5.77a2.25 2.25 0 00-2.25-2.25h-13.5a2.25 2.25 0 00-2.25 2.25v4.07m18 4.22v-4.22" />',
      isActive: false
    },
    {
      label: 'Classes',
      path: '/list_class',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25m0 0v3.378c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V12.128" />',
      isActive: false
    },
    {
      label: 'Matieres',
      path: '/list_subject',
      icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0a8.967 8.967 0 00-6 2.292m6-2.292v14.25" />',
      isActive: false
    }
  ];

  constructor(private sanitizer: DomSanitizer, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.menuItems.forEach(item => {
      item.icon = this.sanitizer.bypassSecurityTrustHtml(item.icon as string);
    });
  }

  @Output() collapsedStateChanged = new EventEmitter<boolean>();

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedStateChanged.emit(this.isCollapsed);
  }

  onMenuClick(item: any) {
    this.menuItems.forEach(i => i.isActive = false);
    item.isActive = true;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  trackByPath(index: number, item: any) {
    return item.path;
  }

  logout() {
    this.authService.logout(this.router);
  }
}
