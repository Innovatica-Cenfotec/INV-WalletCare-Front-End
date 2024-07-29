import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IAccount, IExpense } from '../interfaces';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService extends BaseService<IExpense> {
  protected override source: string = 'expenses';
  private expenseListSignal = signal<IAccount[]>([]);
  private expenseSignal = signal<IAccount | undefined>(undefined);

  get expenses$() {
    return this.expenseListSignal;
  }

  get expense$() {
    return this.expenseSignal;
  }

  saveExpenseSignal(expense: IExpense): Observable<IExpense> {
    return this.add(expense).pipe(
      tap((response: any) => {
        this.expenseListSignal.update(expense => [response, ...expense]);
      }),
      catchError(error => {
        console.error('Error saving expense', error);
        throw error;
      })
    );
  }

  findAllSignal() {
    return this.findAll().subscribe({
      next: (response: any) => {
        this.expenseListSignal.set(response);
      }, error: (error: any) => {
        console.error('Error fetching expenses', error);
        throw error;
      }
    });
  }

  getExpenseSignal(id: number): Observable<IExpense> {
    return this.find(id).pipe(
      tap((response: any) => {
        this.expenseSignal.set(response);
      }),
      catchError(error => {
        console.error('Error fetching expense', error);
        throw error;
      })
    );
  }

  addExpenseToAccountSignal(expense: IExpense): Observable<IExpense> {
    return this.http.post(`${this.source}/add-to-account`, expense).pipe(
      tap((response: any) => {
        this.expenseListSignal.update(expense => [response, ...expense]);
      }),
      catchError(error => {
        console.error('Error adding expense to account', error);
        throw error;
      })
    );
  }
}
