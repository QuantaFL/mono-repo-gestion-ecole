import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {LoginRequest} from "../models/loginRequest";
import {Observable} from "rxjs";
import {LoginResponse} from "../models/LoginResponse";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }
  private baseUrl = 'http://localhost:8000';
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }
}
