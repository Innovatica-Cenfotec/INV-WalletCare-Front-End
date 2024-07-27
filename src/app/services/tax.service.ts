import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IAccount, IAccountUser, IGenericResponse, Itax } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TaxService extends BaseService<IAccount> {
    protected override source: string = 'taxes';
    private taxesSignal = signal<Itax[]>([]);
    
    /*
    * Get the list of taxes
    */
    get taxes$() {
        return this.taxesSignal;
    }

    /**
     * Get the list of taxes
     */
    findAllSignal() {
        return this.findAll().subscribe({
            next: (response: any) => {                
                this.taxesSignal.set(response);
            }, error: (error: any) => {
                console.error('Error getting taxes', error);
                throw error;
            }
        });
    }
}