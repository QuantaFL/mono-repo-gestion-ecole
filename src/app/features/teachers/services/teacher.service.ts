import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CreateSubjectRequest} from "../../subjects/requests/createSubjectRequest";
import {Observable} from "rxjs";
import {Subject} from "../../subjects/models/subject";
import {CreateTeacherRequest} from "../requests/createTeacherRequest";
import {Teacher} from "../models/teacher";
import {UpdateStudentRequest} from "../../students/requests/updateStudentRequest";
import {UpdateTeacherRequest} from "../requests/updateTeacherRequest";

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:8000/api/v1/teachers';

  constructor(private http: HttpClient) {}

  createTeacher(teacher: CreateTeacherRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, teacher);
  }
  getAllTeacher(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${this.apiUrl}`);
  }

  updateStudent(id: number, teacher: UpdateTeacherRequest): void {
    try{
      this.http.put<Teacher>(`${this.apiUrl}/${id}`, teacher);
    }catch (e){
      throw e;
    }
  }
}
