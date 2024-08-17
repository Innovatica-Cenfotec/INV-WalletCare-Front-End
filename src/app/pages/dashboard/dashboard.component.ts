import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IncomesVsExpensesChartComponent } from '../../components/dashboard/charts/incomes-vs-expenses-chart/incomes-vs-expenses-chart.component';
import { EstimatedExpenseVsTotalExpenseChartComponent } from '../../components/dashboard/charts/estimated-expense-vs-total-expense-chart/estimated-expense-vs-total-expense-chart.component';
import { TransactionService } from '../../services/transaction.service';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    IncomesVsExpensesChartComponent,
    EstimatedExpenseVsTotalExpenseChartComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public transactionService = inject(TransactionService);

  public incomes: number[] = [];
  public expenses: number[] = [];

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
  }
}
