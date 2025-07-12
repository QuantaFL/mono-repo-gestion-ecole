import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClassModel } from '../models/class';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private classes: ClassModel[] = [
    { id: 1, name: 'Math 101', academicYear: '2024-2025' },
    { id: 2, name: 'Science 101', academicYear: '2024-2025' },
    { id: 3, name: 'History 101', academicYear: '2024-2025' }
  ];


  constructor() { }

  getAll(): Observable<ClassModel[]> {
    return of(this.classes);
  }
}
