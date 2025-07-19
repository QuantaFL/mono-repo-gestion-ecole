import { Component } from '@angular/core';
import {Teacher} from "../../models/teacher";

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrl: './teacher-list.component.scss'
})
export class TeacherListComponent {
 teachers:Teacher[] = [];
}
