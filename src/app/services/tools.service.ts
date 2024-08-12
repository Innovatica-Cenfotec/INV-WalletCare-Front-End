import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { LoanDTO } from '../interfaces';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolsService extends BaseService<LoanDTO>{
  protected override source: string = 'tools';
  private loansSignal = signal<LoanDTO>({});

  get loans$(){
    return this.loansSignal;
  }

  loanCalculator(loanInfo : LoanDTO | undefined){
    return this.http.post<LoanDTO>(this.source + '/loan-calculator', loanInfo).pipe(
      tap((response: any) => {
        this.loansSignal.set(response);
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );
  }
}
