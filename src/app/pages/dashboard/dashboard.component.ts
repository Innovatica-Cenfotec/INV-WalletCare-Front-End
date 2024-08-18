import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IncomesVsExpensesChartComponent } from '../../components/dashboard/charts/incomes-vs-expenses-chart/incomes-vs-expenses-chart.component';
import { EstimatedExpenseVsTotalExpenseChartComponent } from '../../components/dashboard/charts/estimated-expense-vs-total-expense-chart/estimated-expense-vs-total-expense-chart.component';
import { TransactionService } from '../../services/transaction.service';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { IAccount, IBalance, IBalanceDTO, ITransaction } from '../../interfaces';
import { AccountCardsComponent } from '../../components/account/account-cards/account-cards.component';
import { error } from '@ant-design/icons-angular';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzStatisticModule,
    IncomesVsExpensesChartComponent,
    EstimatedExpenseVsTotalExpenseChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public transactionService = inject(TransactionService);

  public incomes: number[] = [];
  public expenses: number[] = [];

  public totalExpenses: number[] = [];
  public recurringExpenses: number[] = [];

  public generalBalance = 0;
  public generalBalanceColor = '';

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

    this.transactionService.getBalancesByOwner().subscribe({
      next: (balances: IBalanceDTO) => {
        this.totalExpenses = [balances.monthlyExpenseBalance || 0];
        this.recurringExpenses = [balances.recurrentExpensesBalance || 0];
      },
      error: (error => {
        console.log(error);
      })
    });

    this.transactionService.getBalancesByOwner().subscribe({
      next: (balances: IBalanceDTO) => {
        this.generalBalance = (balances.monthlyIncomeBalance || 0) - (balances.monthlyExpenseBalance || 0);

        if (this.generalBalance > 0) {
          this.generalBalanceColor = IBalance.surplus;
        } else if (this.generalBalance < 0) {
          this.generalBalanceColor = IBalance.deficit;
        } else {
          this.generalBalanceColor = IBalance.balance;
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
