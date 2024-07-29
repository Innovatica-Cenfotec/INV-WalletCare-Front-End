import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IForgotResetPassword } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PasswordRecoveryService {
  
  constructor(private http: HttpClient) {}

  sendOTP(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.post(`password/forgot`, email, { headers, responseType: 'text' });
  }

  validateOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`validate-otp`, { email, otp });
  }

  resetPassword(forgotResetPassword:IForgotResetPassword): Observable<any> {
    return this.http.post(`password/reset-password`,  forgotResetPassword);
  }
  sendOTPChange():Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.post('password/change-password-otp',null,{headers,responseType:'text'});
  }
  changePassword(forgotResetPassword:IForgotResetPassword):Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.post('password/change-password',forgotResetPassword);

  }
}
