import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcademicYear } from '../../teacher-dashboard/models/academic-year';

@Injectable({
  providedIn: 'root'
})
export class AcademicYearService {
  private apiUrl = 'http://localhost:8000/api/v1/academic-year';

  constructor(private http: HttpClient) {}

  getCurrentAcademicYear(): Observable<AcademicYear> {
    return this.http.get<AcademicYear>(`${this.apiUrl}/current`);
  }
}
