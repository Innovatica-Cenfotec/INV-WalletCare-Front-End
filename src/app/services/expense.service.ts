import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IExpense } from '../interfaces';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService extends BaseService<IExpense>{
  protected override source: string = 'expenses';
  private expenseListSignal = signal<IExpense[]>([]);
  private expenseSignal = signal<IExpense | undefined>(undefined);

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

  filterByAccountSignal(id: number) {
    let params = { account: id };

    return this.filter(params).subscribe({
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

  /**
   * Deletes an expense signal.
   * @param expense - The expense to be deleted.
   * @returns An Observable that emits the deleted expense.
   */
  deleteExpenseSignal(id: number | undefined): Observable<any> {
    if (!id) {
        throw new Error('Invalid expense ID');
    }

    return this.del(id).pipe(
        tap((response: any) => {
            this.expenseListSignal.update(expenses => expenses.filter(a => a.id !== id));
        }),
        catchError(error => {
            console.error('Error deleting expense', error);
            throw error;
        })
    );
  }
}
