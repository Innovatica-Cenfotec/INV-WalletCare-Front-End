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
      tap((response: any) => {
        this.savingListSignal.update(saving => [response, ...saving]);
      }),
      catchError(error => {
        console.error('Error adding saving to account', error);
        throw error;
      })
    );
  }

}
