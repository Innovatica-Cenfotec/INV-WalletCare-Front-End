import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { CurrencyCodesDTO, CurrencyExchangeDTO, LoanDTO } from '../interfaces';
import { catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolsService extends BaseService<LoanDTO> {
  protected override source: string = 'tools';
  private loansSignal = signal<LoanDTO>({});
  private currencyCodesListSignal = signal<CurrencyCodesDTO>({});
  private currencyExchangeSignal = signal<CurrencyExchangeDTO>({});

  get loans$() {
    return this.loansSignal;
  }

  get currencyCodesList$() {
    return this.currencyCodesListSignal;
  }

  get currecyExchanges$() {
    return this.currencyExchangeSignal;
  }

  /**
   * sends the request to api getting the loan calculation info
   * @param loanInfo is the loan information
   * @returns returns the fee for the loan 
   */
  loanCalculator(loanInfo: LoanDTO | undefined) {
    return this.http.post<LoanDTO>(this.source + '/loan-calculator', loanInfo).pipe(
      tap((response: any) => {
        this.loansSignal.set(response);
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );
  }

  /**
   * sends the request to api getting currency codes
   * @returns the currency codes
   */
  currencyCodes() {
    return this.http.get<CurrencyCodesDTO[]>(`${this.source}/currency-codes`).pipe(
      tap((response: any) => {
        this.currencyCodesListSignal.set(response);
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );
  }

  /**
   * sends the request to api getting the currency exchamge calculation
   * @param currencyExchange is the exchange information
   * @returns the currency exchange 
   */
  curencyExchange(currencyExchange: CurrencyExchangeDTO | undefined) {
    return this.http.post<CurrencyCodesDTO[]>(`${this.source}/exchange`, currencyExchange).pipe(
      tap((response: any) => {
        this.currencyExchangeSignal.set(response);
      }),
      catchError(error => {
        console.error('Error updating account', error);
        throw error;
      })
    );
  }
}
