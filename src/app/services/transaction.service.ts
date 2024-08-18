import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IBalanceDTO, IGenericResponse, ITransaction } from '../interfaces';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService<ITransaction> {

  protected override source: string = 'transactions';
  private transactionListSignal = signal<ITransaction[]>([]);
  private responseSignal = signal<IGenericResponse>({});
  private balancesSignal = signal<IBalanceDTO>({});
  private annuallyExpensesSignal = signal<number[]>([]);
  private annuallyIncomesSignal = signal<number[]>([]);

  get transactions$() {
    return this.transactionListSignal;
  }

  get balances$() {
    return this.balancesSignal;
  }
  get annuallyExpenses$(){
    return this.annuallyExpensesSignal;
  }

  get annuallyIncomes$(){
    return this.annuallyIncomesSignal;
  }

  /**
   * Retreives all the transactions for the account
   * @param id is the account id
   */
  getAllSignal(id: number) {

    this.http.get<ITransaction[]>(`${this.source}/${id}`).subscribe({
      next: (response: any) => {
        response.reverse();
        this.transactionListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching transacctions', error);
      }
    });
  }

  getAllByOwnerSignal() {

    this.http.get<ITransaction[]>(`${this.source}/owner`).subscribe({
      next: (response: any) => {
        response.reverse();
        this.transactionListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching transacctions', error);
      }
    });
  }

  /**
   * Makes a rollback for the transaction
   * @param transaction is the transaction that needs a rollback
   * @returns A message with the status of the rollback
   */
  rollbackTransaction(transaction: ITransaction) {

    return this.http.post(`${this.source}/rollback/${transaction.id}`, transaction).pipe(

      tap((response: any) => {
        this.responseSignal.set({ message: response.message });
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );

  }

  getBalancesByAccount(id: number) {
    return this.http.get(`${this.source}/balances-account/${id}`).pipe(
      tap((response: any) => {
        this.balancesSignal.set(response);
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );
  }

  getBalancesByOwner() {
    return this.http.get<IBalanceDTO>(this.source + '/balances-user').pipe(
      tap((response: any) => {
        this.balancesSignal.set(response);
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );
  }


  getBalancesAnnually() {
    return this.http.get<Array<Array<number>>>(`${this.source}/balances-annually`).pipe(
      tap((response: any) => {
        this.annuallyExpensesSignal.set(response[0]);
        this.annuallyIncomesSignal.set(response[1]);
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );
  }

}
