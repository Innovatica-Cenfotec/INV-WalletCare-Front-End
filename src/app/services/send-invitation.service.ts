import { inject,Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { IAccountUser, IFeedBackMessage, IFeedbackStatus } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class SendInviteService {
  private inviteSignal = signal<any>(null);

  constructor(private http: HttpClient) {}
  feedbackMessage: IFeedBackMessage = {type: IFeedbackStatus.default, message: ''};



  sendInvite(email: string, accountId: number): Observable<any> {
    const payload: IAccountUser={
      user:{
        email:email
      },
      account:{
        id:accountId
      }
    }
    
    return this.http.post('accounts/inviteToSharedAccount', payload).pipe(
      tap((response: any) => {
        this.inviteSignal.set(response);
      }),
      catchError((error: any) => {
        this.feedbackMessage.type=IFeedbackStatus.error;
        this.feedbackMessage.message=error.message
        return (error);
      })
    );
  }
}
