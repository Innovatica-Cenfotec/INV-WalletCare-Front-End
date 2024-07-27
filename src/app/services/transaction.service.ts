import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGenericResponse, ITransaction } from '../interfaces';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService extends BaseService<ITransaction> {

  protected override source: string = 'transactions';
  private transactionListSignal = signal<ITransaction[]>([]);
  private responseSignal = signal<IGenericResponse>({});

  get transactions$() {
    return this.transactionListSignal;
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

  /**
   * Makes a rollback for the transaction
   * @param transaction is the transaction that needs a rollback
   * @returns A message with the status of the rollback
   */
  rollbackTransaction(transaction: ITransaction){

    return this.http.post(`${this.source}/rollback/${transaction.id}`, transaction).pipe(

      tap((response: any) => {
        this.responseSignal.set({message: response.message});
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );

  }
}
