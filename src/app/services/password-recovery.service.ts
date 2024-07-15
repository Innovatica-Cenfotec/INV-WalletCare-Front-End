import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryService {
  private apiUrl = 'http://localhost:4200/password'; 

  constructor(private http: HttpClient) {}

  sendOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot`, { email });
  }

  validateOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-otp`, { email, otp });
  }

  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, otp, newPassword });
  }
}
