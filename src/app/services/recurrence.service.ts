import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IAccount, IAccountUser, IGenericResponse, IRecurrence, IResponse, IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { error } from '@ant-design/icons-angular';

@Injectable({
    providedIn: 'root',
})
export class RecurrenceService extends BaseService<IAccount> {
    protected override source: string = 'recurrences';
    private accountListIncomeSignal = signal<IRecurrence[]>([]);
    private accountListExpenseSignal = signal<IRecurrence[]>([]);
    
    get recurrencesIncome$(){
        return this.accountListIncomeSignal;
    }

    get recurrencesExpense$(){
        return this.accountListExpenseSignal;
    }

    /**
     * Get all recurrences
     * @returns An signal with all recurrences
     */
    findAllSignal() {
        return this.findAll().subscribe({
            next: (response: any) => {
                const recurrencesIncome = response.filter((recurrence: IRecurrence) => recurrence.expense === null);
                this.accountListIncomeSignal.set(recurrencesIncome);

                const recurrencesExpense = response.filter((recurrence: IRecurrence) => recurrence.income === null);            
                this.accountListExpenseSignal.set(recurrencesExpense);
            },
            error: (error: any) => {
                console.error('Error getting accounts', error);
            }
        });
    }

    /**
     * Deletes recurrence signal.
     * @param id The ID of what is to be deleted.
     * @returns An Observable that emits the deleted account.
     */
    deleteRecurrenceSignal(id: number | undefined): Observable<IResponse<IGenericResponse>> {
        if (!id) {
            throw new Error('Invalid account ID');
        }

        return this.del(id).pipe(
            tap((response: any) => {
                this.accountListIncomeSignal.update(recurrences => recurrences.filter(recurrence => recurrence.id !== id));
                this.accountListExpenseSignal.update(recurrences => recurrences.filter(recurrence => recurrence.id !== id));
            }),
            catchError(error => {
                console.error('Error deleting account', error);
                throw error;
            })
        );
    }
}