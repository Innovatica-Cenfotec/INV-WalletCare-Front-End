import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IAccount, IIncome } from '../interfaces';
import { Observable, catchError, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IncomeService extends BaseService<IIncome> {
    protected override source: string = 'incomes';
    private incomeListSignal = signal<IAccount[]>([]);
    private incomeSignal = signal<IAccount | undefined>(undefined);

    /*
    * Gets the incomes.
    */
    get incomes$() {
        return this.incomeListSignal;
    }

    /*
    * Gets the income.
    */
    get income$() {
        return this.incomeSignal;
    }
    
    /**
     * Saves an income signal.
     * 
     * @param income - The income signal to be saved.
     * @returns An Observable that emits the saved income signal.
     */
    saveIncomeSignal(income: IIncome): Observable<IIncome> {
        return this.add(income).pipe(
            tap((response: any) => {
                this.incomeListSignal.update(income => [response, ...income]);
            }),
            catchError(error => {
                console.error('Error saving income', error);
                throw error;
            })
        );
    }

    /**
     * Get all incomes
     * @returns An signal with all incomes.
    */
    findAllSignal() {
        return this.findAll().subscribe({
            next: (response: any) => {                
                this.incomeListSignal.set(response);
            }, error: (error: any) => {
                console.error('Error fetching incomes', error);
                throw error;
            }
        });
    }

    /**
     * Get an income
     * @param id - The ID of the income
     * @returns An Observable that emits the income.
     */
    getIncomeSignal(id: number): Observable<IAccount> {
        return this.find(id).pipe(
            tap((response: any) => {
                this.incomeSignal.set(response);
            }),
            catchError(error => {
                console.error('Error fetching income', error);
                throw error;
            })
        );
    }

    /**
     * Updates an income signal.
     * @param account - The income signal to be updated.
     * @returns An Observable that emits the updated income signal.
     */
    updateIncomeSignal(income: IIncome): Observable<any> {
        return this.edit(income.id, income).pipe(
            tap((response: any) => {
                this.incomeListSignal.update(income => income.map(a => a.id === response.id ? response : a));
                this.incomeSignal.set(response);
            }),
            catchError(error => {
                console.error('Error updating income', error);
                throw error;
            })
        );
    }

    /**
     * Deletes an income signal.
     * @param account - The income signal to be deleted.
     * @returns An Observable that emits the deleted income signal.
     */
    deleteIncomeSignal(id: number | undefined): Observable<any> {
        if (!id) {
            throw new Error('Invalid account ID');
        }

        return this.del(id).pipe(
            tap((response: any) => {
                this.incomeListSignal.update(income => income.filter(a => a.id !== id));
            }),
            catchError(error => {
                console.error('Error deleting account', error);
                throw error;
            })
        );
    }
}