import {Component, HostListener, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import Chart from 'chart.js/auto';
import {StudentService} from "../../../students/services/student.service";
import {TeacherService} from "../../../teachers/services/teacher.service";
import {ClassService} from "../../../class/services/class.service";
import {Student} from "../../../students/models/student";
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {
  totalStudents: number = 0;
  totalStudentsModel: Student[] | undefined;
  totalTeacher: number = 0;
  totalClasses: number = 0;

  constructor(private router: Router, private studentService: StudentService, private teacherService: TeacherService, private classService: ClassService) {
    this.checkScreen();
  }

  async ngOnInit(): Promise<void> {
    this.totalStudentsModel = await this.studentService.getAllStudentss();
    this.teacherService.getAllTeacher().subscribe(
      (teachers) => {
        this.totalTeacher = teachers.length;
      },
      (error) => {
        console.error('Erreur lors de la récupération des enseignants:', error);
      }
    );
    this.classService.getAllClasses().subscribe(
      (classes) => {
        this.totalClasses = classes.length;
      },
      (error) => {
        console.error('Erreur lors de la récupération des classes:', error);
      }
    );

    this.createStudentsChart();
    this.createPresenceChart();
  }
  activeMenu: string | null = null;

toggleMenu(menu: string): void {
  this.activeMenu = this.activeMenu === menu ? null : menu;
}

  createStudentsChart(): void {
    const ctx = document.getElementById('studentsChart') as HTMLCanvasElement;
    console.log(this.totalStudentsModel)

    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Garçons', 'Filles'],
          datasets: [{
            data: [this.totalStudentsModel!.at(0)!.maleCount, this.totalStudentsModel!.at(0)!.femaleCount], // Example data
            backgroundColor: ['#42A5F5', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            datalabels: {
              color: '#fff',
              formatter: (value: number, context: any) => {
                return `${((value / this.totalStudentsModel!.length) * 100).toFixed(1)}%`;
              },
            },
            title: {
              display: true,
              text: 'Répartition des élèves par sexe'
            }
          }
        },
        plugins: [ChartDataLabels]
      });
    }
  }

  createPresenceChart(): void {
    const ctx = document.getElementById('presenceChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Classe A', 'Classe B', 'Classe C', 'Classe D', 'Classe E'],
          datasets: [{
            label: 'Présence',
            data: [45, 38, 50, 42, 30], // Example data
            backgroundColor: '#66BB6A'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Présences par classe'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }
   isCollapsed = false;
  isMobile = false;


  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  checkScreen() {
    this.isMobile = window.innerWidth < 992;
    if (this.isMobile) {
      this.isCollapsed = true;
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout() {
    this.router.navigate(['/login']);
  }

}
