import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {

  ngOnInit(): void {
    this.createStudentsChart();
    this.createPresenceChart();
  }

  createStudentsChart(): void {
    const ctx = document.getElementById('studentsChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Garçons', 'Filles'],
          datasets: [{
            data: [300, 212], // Example data
            backgroundColor: ['#42A5F5', '#FF6384']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Répartition des élèves par sexe'
            }
          }
        }
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
}
