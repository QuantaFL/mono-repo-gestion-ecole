import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {
  classes: any[] = [
    {
      id: 1,
      name: '6e',
      level: 'Collège',
      latest_student_session: [
        { id: 1, student_id: 1, student_name: 'Alice', grade: 15 },
        { id: 2, student_id: 2, student_name: 'Bob', grade: null },
        { id: 3, student_id: 3, student_name: 'Charlie', grade: 12 }
      ]
    },
    {
      id: 2,
      name: '5e',
      level: 'Collège',
      latest_student_session: [
        { id: 4, student_id: 4, student_name: 'David', grade: 14 },
        { id: 5, student_id: 5, student_name: 'Eva', grade: null }
      ]
    },
    {
      id: 3,
      name: '4e',
      level: 'Collège',
      latest_student_session: []
    }
    // Add more mocked classes as needed
  ];
  loading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {}

  showInfo(classe: any): void {
    alert('Classe: ' + classe.name + '\nNiveau: ' + classe.level);
  }
}
