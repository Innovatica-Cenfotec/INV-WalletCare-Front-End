import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IAccount, IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AccountService extends BaseService<IAccount> {
    protected override source: string = 'accounts';
    private accountListSignal = signal<IAccount[]>([]);

    /*
    * Gets the accounts signal.
    */
    get accounts$() {
        return this.accountListSignal;
    }

    /**
     * Saves an account signal.
     * @param account - The account to be saved.
     * @returns An Observable that emits the saved account.
     */
    saveAccountSignal(account: IAccount): Observable<IAccount> {
        return this.add(account).pipe(
            tap((response: any) => {
                this.accountListSignal.update(accounts => [response, ...accounts]);
            }),
            catchError(error => {
                console.error('Error saving account', error);
                throw error;
            })
        );
    }


/**
 * Get all accounts by owner
 * @returns An signal with all accounts by owner
*/
    findAllSignal() {
        return this.findAll().subscribe({
            next: (response: any) => {
                this.accountListSignal.set(response);
            }, error: (error: any) => {
                console.error('Error  fectching accounts', error);
                throw error;
            }
        });
    }
}