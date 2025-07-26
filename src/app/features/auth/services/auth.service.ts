import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../models/user";
import {LoginRequest} from "../requests/loginRequest";
import {Observable} from "rxjs";
import {LoginResponse} from "../requests/LoginResponse";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http:HttpClient) { }
  private baseUrl = 'http://localhost:8000/api/v1/auth';

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }
  changePassword(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(
      `${this.baseUrl}/change-password`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }
  logout(router: any) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.navigate(['/login']);
  }
}
