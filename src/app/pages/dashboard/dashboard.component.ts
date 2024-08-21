import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

// Importing Ng-Zorro modules
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

// Custom elements
import { IBalance, IBalanceDTO, CurrencyCodesDTO, CurrencyExchangeDTO, IBarchartData } from '../../interfaces';
import { TransactionService } from '../../services/transaction.service';
import { ToolsService } from '../../services/tools.service';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/imcome.service';
import { GoalService } from '../../services/goal.service';
import { BarchartComponent } from '../../components/dashboard/charts/barchart/barchart.component';
import { PiechartComponent } from '../../components/dashboard/charts/piechart/piechart.component';
import { IncomesVsExpensesChartComponent } from '../../components/dashboard/charts/incomes-vs-expenses-chart/incomes-vs-expenses-chart.component';
import { EstimatedExpenseVsTotalExpenseChartComponent } from '../../components/dashboard/charts/estimated-expense-vs-total-expense-chart/estimated-expense-vs-total-expense-chart.component';
import { CurrenciesChartComponent } from '../../components/dashboard/charts/currencies-chart/currencies-chart.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzIconModule,
        NzPopoverModule,
        NzCardModule,
        NzGridModule,
        NzStatisticModule,
        NzFormModule,
        NzInputModule,
        NzSelectModule,
        NzButtonModule,
        BarchartComponent,
        PiechartComponent,
        IncomesVsExpensesChartComponent,
        EstimatedExpenseVsTotalExpenseChartComponent,
        CurrenciesChartComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    // Services
    private nzNotificationService = inject(NzNotificationService);
    public fb = inject(FormBuilder);
    public transactionService = inject(TransactionService);
    public expenseService = inject(ExpenseService);
    public incomeService = inject(IncomeService);
    public goalService = inject(GoalService);
    public toolsService = inject(ToolsService);

    // Var
    public incomes: number[] = [];
    public expenses: number[] = [];
    public days: number[] = [];
    public exchangeRate: number[] = [];
    public currencyCodes: CurrencyCodesDTO[] = [];
    public loading = false;

    public validateForm = this.fb.group({
      currencyTo: ['', [Validators.required]],
    });

    public totalExpenses: number[] = [];
    public recurringExpenses: number[] = [];

    public generalBalance = 0;
    public generalBalanceColor = '';

    monthOrder = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    goalStatusOrder = ["Completados", "En proceso"];

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

        this.toolsService.currencyCodes().subscribe({
            next: (response: any) => {
                this.currencyCodes = response;
            },
            error: (error => {
                this.nzNotificationService.error('Error', error.error.detail)
            })
        });

        this.expenseService.reportAnualAmountByCategory(new Date().getFullYear()).subscribe({
            next: (response: any) => {
            },
            error: (error => {
                this.nzNotificationService.error('Error', error.error.detail)
            })
        });

        this.incomeService.reportAnualAmountByCategory(new Date().getFullYear()).subscribe({
            next: (response: any) => {
            },
            error: (error => {
                this.nzNotificationService.error('Error', error.error.detail)
            })
        });

        this.goalService.reportProgressByStatus();
    }

    handleSubmit() {
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
