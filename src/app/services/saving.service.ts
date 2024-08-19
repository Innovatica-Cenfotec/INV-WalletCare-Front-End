import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ISaving } from '../interfaces';
import { Observable, tap, catchError } from 'rxjs';
import { error } from '@ant-design/icons-angular';

@Injectable({
  providedIn: 'root'
})
export class SavingService extends BaseService<ISaving> {
  protected override source: string = 'savings';
  private savingSignal = signal<ISaving | undefined>(undefined);
  private savingListSignal = signal<ISaving[]>([]);

  get savings$() {
    return this.savingListSignal;
  }

  get saving$() {
    return this.savingSignal;
  }

  saveSavingSignal(saving: ISaving): Observable<ISaving> {
    return this.add(saving).pipe(
      tap((response: any) => {
        this.savingListSignal.update(saving => [response, ...saving]);
      }),
      catchError(error => {
        console.error('Error save saving', error);
        throw error;
      })
    );
  }

  findAllSignal() {
    return this.findAll().subscribe({
      next: (response: any) => {
        this.savingListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching savings', error);
        throw error;
      }
    })
  }

  addSavingToAccountSignal(saving: ISaving): Observable<any> {
    return this.http.post(`${this.source}/add-to-account`, saving).pipe(
      catchError(error => {
        console.error('Error adding saving to account', error);
        throw error;
      })
    );
  }

  updateSavingSignal(saving: ISaving): Observable<any> {
    return this.edit(saving.id, saving).pipe(
      tap((response: any) => {
        this.savingListSignal.update(saving => saving.map(a => a.id === response.id ? response : a));
        this.savingSignal.set(response);
      }),
      catchError(error => {
        console.error('Error updating saving', error);
        throw error;
      })
    );
  }

  deleteSavingSignal(id: number | undefined): Observable<any> {
    if (!id) {
      throw new Error('Invalid Saving ID');
    }

    return this.del(id).pipe(
      tap((response: any) => {
        this.savingListSignal.update(income => income.filter(a => a.id !== id));
      }),
      catchError(error => {
        console.error('Error deleting account', error);
        throw error;
      })
    );
  }

}
