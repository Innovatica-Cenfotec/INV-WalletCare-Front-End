import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IAccount, IAccountUser, IGenericResponse, IResponse, IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { error } from '@ant-design/icons-angular';

@Injectable({
    providedIn: 'root',
})
export class AccountService extends BaseService<IAccount> {
    protected override source: string = 'accounts';
    private accountListSignal = signal<IAccount[]>([]);
    private accountSignal = signal<IAccount | undefined>(undefined);
    private membersAccountSignal = signal<IAccountUser[]>([]);
    private responseSignal = signal<IGenericResponse>({});
    /*
    * Gets the accounts signal.
    */
    get accounts$() {
        return this.accountListSignal;
    }

    /*
    * Gets the account signal.
    */
    get account$() {
        return this.accountSignal;
    }

    /*
    * Gets the members account signal.
    */
    get membersAccount$() {
        return this.membersAccountSignal;
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

    /**
     * Get all members of an account
     * @param id - The ID of the account
     * @returns An Observable that emits an array of users.
     */
    getAccountSignal(id: number): Observable<IAccount> {
        return this.find(id).pipe(
            tap((response: any) => {
                this.accountSignal.set(response);
            }),
            catchError(error => {
                console.error('Error fetching account', error);
                throw error;
            })
        );
    }

    /**
     * Get all members of an account
     * @param id - The ID of the account
     * @returns An Observable that emits an array of users.
     */
    getMembersSignal(id: number) {
        return this.http.get<IAccountUser[]>(`${this.source}/members/${id}`).subscribe({
            next: (response: any) => {
                this.membersAccountSignal.set(response);
            }, error: (error: any) => {
                console.error('Error fetching members', error);
                throw error;
            }
        });
    }

    /**
     * Updates an account signal.
     * @param account - The account to be updated.
     * @returns An Observable that emits the updated account.
     */
    updateAccountSignal(account: IAccount): Observable<any> {
        return this.edit(account.id, account).pipe(
            tap((response: any) => {
                this.accountListSignal.update(accounts => accounts.map(a => a.id === response.id ? response : a));
                this.accountSignal.set(response);
            }),
            catchError(error => {
                console.error('Error updating account', error);
                throw error;
            })
        );
    }

    /**
     * Deletes an account signal.
     * @param account - The account to be deleted.
     * @returns An Observable that emits the deleted account.
     */
    deleteAccountSignal(id: number | undefined): Observable<any> {
        if (!id) {
            throw new Error('Invalid account ID');
        }

        return this.del(id).pipe(
            tap((response: any) => {
                this.accountListSignal.update(accounts => accounts.filter(a => a.id !== id));
            }),
            catchError(error => {
                console.error('Error deleting account', error);
                throw error;
            })
        );
    }

    /**
     * Manages the status of a shared account invitation.
     * @param accountUser The account user object containing the updated invitation status.
     * @returns An Observable that emits the HTTP response data when the request is successful.
     */
    manageSharedAccounInvitationtStatus(accountUser: IAccountUser): Observable<any> {
        return this.http.put(`${this.source}/invitation/${accountUser.account?.id}`, accountUser).pipe(
            tap((response:any)=>{
                
                this.responseSignal.set({message: response.message});
            }),
            catchError(error => {
                console.error('Error deleting account', error);
                throw error;
            })
        );
    }
}