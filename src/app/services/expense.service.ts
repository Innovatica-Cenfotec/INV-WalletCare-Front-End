import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGenericResponse, IExpense, IBarchartData, IBarcharItem } from '../interfaces';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService extends BaseService<IExpense> {
    protected override source: string = 'expenses';
    private responseSignal = signal<IGenericResponse>({});
    private expenseListSignal = signal<IExpense[]>([]);
    private expenseSignal = signal<IExpense | undefined>(undefined);

    /*
    * Get the expenses.
    */
    get expenses$() {
        return this.expenseListSignal.asReadonly();
    }

    /*
    * Get the expense.
    */
    get expense$() {
        return this.expenseSignal.asReadonly();
    }

    /**
     * Saves an expense signal.
     * @param expense - The expense signal to be saved.
     * @returns An Observable that emits the saved expense signal.
     */
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


    /**
     * Retreives all the texpenses owned by the user
     */
    findAllSignal() {
        return this.findAll().subscribe({
            next: (response: any) => {
                const sortedResponse = response.sort((a: any, b: any) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
                this.expenseListSignal.set(sortedResponse);
            }, error: (error: any) => {
                console.error('Error fetching expenses', error);
                throw error;
            }
        })
    };

    /**
     * Get list of expenses by account signal.
     * @param id - The account id to search.
     * @returns An Observable that emits the expenses.
     */
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

    /**
     * Get list of expenses by account signal.
     * @param id - The account id to search.
     * @returns An Observable that emits the expenses.
     */
    findAllTemplatesSignal() {
        return this.http.get<IExpense[]>(`${this.source}/templates`).subscribe({
            next: (response: any) => {
            response.reverse();
            this.expenseListSignal.set(response);
            },
            error: (error: any) => {
            console.error('Error fetching transacctions', error);
            }
        });
    }

    /**
     * Get list of expenses by account signal.
     * @param id - The account id to search.
     * @returns An Observable that emits the expenses.
     */
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
      
    /**
     * Updates an expense signal.
     * @param expense - The expense to be updated.
     * @returns An Observable that emits the updated expense.
     */
    updateExpenseSignal(expense: IExpense): Observable<any> {
        return this.edit(expense.id, expense).pipe(
            tap((response: any) => {
                this.expenseListSignal.update(accounts => accounts.map(a => a.id === response.id ? response : a));
                this.expenseSignal.set(response);
            }),
            catchError(error => {
                console.error('Error updating expense', error);
                throw error;
            })
        );
    }

    /**
     * Deletes an expense signal.
     * @param id - The expense to be deleted.
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

    reportAnualAmountByCategory() {
        return [
            {
                category: 'comida',
                data: [
                    { amount: 132000.34, month: 'Ene' },
                    { amount: 120000.00, month: 'Dic' },
                    { amount: 110000.50, month: 'Mar' }
                ],
            },
            {
                category: 'juegos',
                data: [
                    { amount: 132000.34, month: 'Ene' },
                    { amount: 120000.00, month: 'Feb' },
                    { amount: 110000.50, month: 'Mar' }
                ],
            },
            {
                category: 'mascota',
                data: [
                    { amount: 132000.34, month: 'Ene' },
                    { amount: 120000.00, month: 'Jul' },
                    { amount: 110000.50, month: 'Jun' }
                ],
            },
            {
                category: 'deporte',
                data: [
                    { amount: 132000.34, month: 'Ene' },
                    { amount: 120000.00, month: 'Feb' },
                    { amount: 110000.50, month: 'Mar' }
                ],
            }
        ];
    }
}
