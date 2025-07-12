import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Class } from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private classes: Class[] = [
    { id: 1, name: 'Math 101', teacherId: 1 },
    { id: 2, name: 'Science 101', teacherId: 2 },
    { id: 3, name: 'History 101', teacherId: 3 }
  ];

  constructor() { }

  getAll(): Observable<Class[]> {
    return of(this.classes);
  }
}
