import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassModel } from '../models/class';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private apiUrl = 'http://localhost:8000/api/v1/classes'; // Adapter l'URL si besoin

  constructor(private http: HttpClient) {}

  getAll(): Observable<ClassModel[] > {
    return this.http.get<ClassModel[]>(`${this.apiUrl}`);
  }

  getById(id: number): Observable<ClassModel> {
    return this.http.get<ClassModel>(`${this.apiUrl}/${id}`);
  }

  create(classe: { name: string; academic_year: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, classe);
  }

  update(id: number, classe: { name: string; academic_year: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, classe);
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
