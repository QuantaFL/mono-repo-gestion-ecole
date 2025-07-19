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
  private apiUrl = 'http://localhost:8000/api/teachers'; // adapte l'URL si besoin

  constructor(private http: HttpClient) {}

  createTeacher(teacher: CreateTeacherRequest): void {
    try{
      this.http.post(`${this.apiUrl}`, teacher);
      console.log("Teacher created successfully");
    }catch (e){
      throw e
    }
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
