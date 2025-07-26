import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';;
import { getUserFromLocalStorage } from '../../../core/utils/user.utils';
import {User} from "../../auth/models/user";
import {Teacher} from "../../teachers/models/teacher";
import {TeacherService} from "../../teachers/services/teacher.service";

@Injectable({
  providedIn: 'root'
})
export class TeacherStore {
  private _currentTeacher = new BehaviorSubject<Teacher | null>(null);
  readonly currentTeacher$: Observable<Teacher | null> = this._currentTeacher.asObservable();

  constructor(private teacherService: TeacherService) {
    this.loadTeacherFromLocalStorage();
  }

  private loadTeacherFromLocalStorage(): void {
    const user = getUserFromLocalStorage();
    if (user) {
      const teacher = this.teacherService.getTeacherByUserId(user.id!).subscribe(
        (teacher: Teacher) => {
          this._currentTeacher.next(teacher);
          localStorage.setItem('teacher', JSON.stringify(teacher));
        },
        (error) => {
          console.error('Error fetching teacher from API:', error);
          this._currentTeacher.next(null);
        }
      )
    }
  }

  setTeacher(teacher: Teacher | null): void {
    this._currentTeacher.next(teacher);
    if (teacher) {
      localStorage.setItem('teacher', JSON.stringify(teacher));
    } else {
      localStorage.removeItem('teacher');
    }
  }

  getCurrentTeacherValue(): Teacher | null {
    return this._currentTeacher.getValue();
  }
}
