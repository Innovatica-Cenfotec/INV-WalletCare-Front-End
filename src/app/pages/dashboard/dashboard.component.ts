import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Services
import { AuthService } from './../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/imcome.service';
import { TransactionService } from '../../services/transaction.service';
import { ToolsService } from '../../services/tools.service';
import { UserService } from '../../services/user.service';
import { AccountService } from '../../services/account.service';
import { GoalService } from '../../services/goal.service';

// Interfaces
import { IAccount, IBalance, IBalanceDTO, CurrencyCodesDTO, CurrencyExchangeDTO, IBarchartData, ITransaction } from '../../interfaces';

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
import { error } from '@ant-design/icons-angular';

// Custom elements
import { AccountCardsComponent } from '../../components/account/account-cards/account-cards.component';
import { BarchartComponent } from '../../components/dashboard/charts/barchart/barchart.component';
import { CurrenciesChartComponent } from '../../components/dashboard/charts/currencies-chart/currencies-chart.component';
import { IncomesVsExpensesChartComponent } from '../../components/dashboard/charts/incomes-vs-expenses-chart/incomes-vs-expenses-chart.component';
import { EstimatedExpenseVsTotalExpenseChartComponent } from '../../components/dashboard/charts/estimated-expense-vs-total-expense-chart/estimated-expense-vs-total-expense-chart.component';
import { NewUsersChartComponent } from '../../components/dashboard/charts/new-users-chart/new-users-chart.component';
import { IncomesVsExpensesMonthlyChartComponent } from '../../components/dashboard/charts/incomes-vs-expenses-monthly-chart/incomes-vs-expenses-monthly-chart.component';
import { PiechartComponent } from '../../components/dashboard/charts/piechart/piechart.component';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzPopoverModule,
    BarchartComponent,
    ReactiveFormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzGridModule,
    NzStatisticModule,
    IncomesVsExpensesChartComponent,
    EstimatedExpenseVsTotalExpenseChartComponent,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    CurrenciesChartComponent,
    AccountCardsComponent,
    IncomesVsExpensesMonthlyChartComponent,
    PiechartComponent,
    NewUsersChartComponent        
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
  public toolsService = inject(ToolsService);
  public authService = inject(AuthService);
  public usersService = inject(UserService);
  public accountService = inject(AccountService);
  public goalService = inject(GoalService);
  
  // Var
  public incomesAnnualy: number[] = [];
  public expensesAnnualy: number[] = [];
  public incomesMonthly: number[] = [];
  public expensesMonthly: number[] = [];
  public daysExchange: number[] = [];
  public exchangeRate: number[] = [];
  public currencyCodes: CurrencyCodesDTO[] = [];
  public incomeMonthByCategoryReport: IBarchartData[] = [];
  public expenseMonthByCategoryReport: IBarchartData[] = [];
  public totalExpenses: number[] = [];
  public recurringExpensesChart: number[] = [];
  public loading = false;
  public generalBalance = 0;
  public generalBalanceColor = '';
  monthOrder = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  goalStatusOrder = ["completados", "en proceso"];

  public validateForm = this.fb.group({
    currencyTo: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData() {
        if(this.authService.isAdmin()) {
            this.usersService.getNewUsersThisYear();
        }

        this.accountService.findAllSignal();
        this.transactionService.getAllByOwnerSignal();
        this.goalService.reportProgressByStatus();

        this.expenseService.reportAnualAmountByCategory(new Date().getFullYear()).subscribe({
            next: (response: any) => {
                //this.expenseMonthByCategoryReport = response;
            },
            error: (error => {
                console.log(error);
                //this.nzNotificationService.error('Error', error.error.detail)
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
        
        this.transactionService.getBalancesAnnually().subscribe({
            next: (response: any) => {
                this.expensesAnnualy = response[0];
                this.incomesAnnualy = response[1];
            },
            error: (error => {
                console.log(error);
            })
        });

        this.transactionService.getBalancesMonthly().subscribe({
            next: (response: any) => {
                this.expensesMonthly = response[1];
                this.incomesMonthly = response[2];
            },
            error: (error => {
                console.log(error);
            })
        });

        this.transactionService.getBalancesByOwner().subscribe({
            next: (balances: IBalanceDTO) => {
                this.totalExpenses = [balances.monthlyExpenseBalance || 0];
                this.recurringExpensesChart = [balances.recurrentExpensesBalance || 0];
            },
            error: (error => {
                console.log(error);
            })
        });
    
        
        this.toolsService.currencyCodes().subscribe({
            next: (response: any) => {
                this.currencyCodes = response;
        
                /*
                Only way found to load missing charts.
                Always after services of charts that do not load unless you resize 
                or change pages, ensure it is inside a subscription.
                */
                window.dispatchEvent(new Event("resize"));
            },
            error: (error => {
                console.log(error);
                //this.nzNotificationService.error('Error', error.error.detail)
            })
        });
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
                this.daysExchange = response[0];
                this.exchangeRate = response[1];
                this.loading = false;
            },
            error: (error => {
                this.nzNotificationService.error('Error', error.error.detail)
            })
        });
    }
}
