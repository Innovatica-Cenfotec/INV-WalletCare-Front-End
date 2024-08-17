import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IncomesVsExpensesChartComponent } from '../../components/dashboard/charts/incomes-vs-expenses-chart/incomes-vs-expenses-chart.component';
import { TransactionService } from '../../services/transaction.service';


import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CurrencyCodesDTO, CurrencyExchangeDTO } from '../../interfaces';
import { ToolsService } from '../../services/tools.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CurrenciesChartComponent } from '../../components/dashboard/charts/currencies-chart/currencies-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    IncomesVsExpensesChartComponent,
    CurrenciesChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public transactionService = inject(TransactionService);

  public incomes: number[] = [];
  public expenses: number[] = [];
  public days: number[] = [];
  public exchangeRate: number[] = [];
  public fb = inject(FormBuilder);
  public currencyCodes: CurrencyCodesDTO[] = [];
  public loading = false;
  public toolsService = inject(ToolsService);
  private nzNotificationService = inject(NzNotificationService);
  

  public validateForm = this.fb.group({
    currencyTo: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.transactionService.getBalancesAnnually().subscribe({
      next: (response: any) => {
        this.expenses = response[0];
        this.incomes = response[1];
      },
      error: (error => {
        console.log(error);
      })
    });


    this.toolsService.currencyCodes().subscribe({
      next: (response: any) => {
          this.currencyCodes = response;
      },
      error: (error => {
          this.nzNotificationService.error('Error', error.error.detail)
      })
  });

  }

  handleSubmit(){
    for (const key in this.validateForm.controls) {
      console.log(this.validateForm.get(key)?.value)
      if (typeof this.validateForm.get(key)?.value === 'string') {
          // Trim the string
          this.validateForm.get(key)?.setValue(this.validateForm.get(key)?.value?.trim());
      }

      // If the form control is invalid, mark it as dirty
      if (this.validateForm.get(key)?.invalid) {
          this.validateForm.get(key)?.markAsDirty();
          this.validateForm.get(key)?.updateValueAndValidity({ onlySelf: true });
      }
  }

  if (this.validateForm.invalid) {
      return;
  }

  const exchange: CurrencyExchangeDTO = {
      currencyFrom: "USD",
      currencyTo: this.validateForm.value.currencyTo
  }

  this.loading = true;

  this.toolsService.monthlyCurencyExchange(exchange).subscribe({
      next: (response: any) => {
          this.days = response[0];
          this.exchangeRate = response[1];
          this.loading = false;
      },
      error: (error => {
          this.nzNotificationService.error('Error', error.error.detail)
      })
  });
  }
}
