import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TeacherDashboardService } from '../../services/teacher-dashboard.service';
import { ClassModel } from '../../models/class-model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {AuthService} from "../../../auth/services/auth.service";
import { TeacherStore } from '../../services/teacher.store';
import { Teacher } from '../../../teachers/models/teacher';

interface MenuItem {
  label: string;
  path?: string;
  icon: string | SafeHtml;
  isActive: boolean;
  children?: MenuItem[];
}

@Component({
  selector: 'app-teacher-dashboard-sidebar',
  templateUrl: './teacher-dashboard-sidebar.component.html',
  styleUrls: ['./teacher-dashboard-sidebar.component.scss']
})
export class TeacherDashboardSidebarComponent implements OnInit {
  @Output() collapsedStateChanged = new EventEmitter<boolean>();

  isCollapsed = false;
  isMobile = false;

  menuItems: MenuItem[] = [];

  teacherClasses: ClassModel[] = [];
  selectedClass: ClassModel | null = null;

  currentTeacher: Teacher | null = null;

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private teacherDashboardService: TeacherDashboardService,
    private router: Router,
    private teacherStore: TeacherStore
  ) { }

  ngOnInit() {
    this.teacherStore.currentTeacher$.subscribe(teacher => {
      this.currentTeacher = teacher;
      if (this.currentTeacher && this.currentTeacher.userModel) {
        this.initializeMenuItems();
        this.loadTeacherClasses();
      }
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveMenuItem(event.urlAfterRedirects);
    });

    this.checkMobile();
    window.addEventListener('resize', this.checkMobile.bind(this));
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) {
      this.isCollapsed = true;
      this.collapsedStateChanged.emit(true);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.collapsedStateChanged.emit(this.isCollapsed);
  }

  trackByPath(index: number, item: MenuItem): string | undefined {
    return item.path || item.label;
  }

  onMenuClick(item: MenuItem): void {
    if (item.path) {
      this.router.navigate([item.path]);
    } else if (item.children && item.children.length > 0) {
      // Toggle children visibility or handle as needed
      // For now, just navigate to the first child if it exists
      if (item.children[0].path) {
        this.router.navigate([item.children[0].path]);
      }
    }
  }

  logout() {
    this.authService.logout(this.router);
  }

  initializeMenuItems() {
    this.menuItems = [
      {
        label: 'Dashboard',
        path: '/teacher-dashboard',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 8.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25v2.25A2.25 2.25 0 018.25 18H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25 2.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />',
        isActive: false
      },
      {
        label: 'Mes Classes',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25m0 0v3.378c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V12.128" />',
        isActive: false,
        children: []
      },
      {
        label: 'Informations Personnelles',
        path: '/teacher-dashboard/profile',
        icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a8.967 8.967 0 0015 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />',
        isActive: false
      }
    ];

    this.menuItems.forEach(item => {
      item.icon = this.sanitizer.bypassSecurityTrustHtml(item.icon as string);
    });
  }

  updateActiveMenuItem(url: string): void {
    this.menuItems.forEach(item => {
      item.isActive = false;
      if (item.children) {
        item.children.forEach(child => child.isActive = false);
      }
    });

    this.menuItems.forEach(item => {
      if (item.path && url === item.path) {
        item.isActive = true;
      } else if (item.children) {
        item.children.forEach(child => {
          if (child.path && url.includes(child.path)) { // Use includes for child paths
            child.isActive = true;
            item.isActive = true; // Activate parent if child is active
          }
        });
      }
    });
  }

  loadTeacherClasses(): void {
    if (this.currentTeacher && this.currentTeacher.userModel && this.currentTeacher.userModel.id) {
      this.teacherDashboardService.getAcademicYears().subscribe({
        next: (years) => {
          const activeYear = years.find(year => year.status === 'active') || years[0];
          if (activeYear) {
            this.teacherDashboardService.getTeacherClasses(this.currentTeacher!.id!, activeYear.id).subscribe({
              next: (classes) => {
                this.teacherClasses = classes;
                this.updateMyClassesMenuItem();
              },
              error: (err) => {
                console.error('Error fetching teacher classes:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error fetching academic years:', err);
        }
      });
    }
  }

  updateMyClassesMenuItem(): void {
    const myClassesMenuItem = this.menuItems.find(item => item.label === 'Mes Classes');
    if (myClassesMenuItem) {
      myClassesMenuItem.children = this.teacherClasses.map(cls => ({
        label: cls.name,
        path: `/teacher-dashboard/class-details/${cls.id}`,
        icon: '', // No icon for sub-items
        isActive: false
      }));
    }
  }
}
