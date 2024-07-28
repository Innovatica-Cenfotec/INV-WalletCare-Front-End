import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { AccountListComponent } from "../../components/account/account-list/account-list.component";
import { AccountCardsComponent } from "../../components/account/account-cards/account-cards.component";
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';
import { ExpenseService } from '../../services/expense.service';
import { AccountService } from '../../services/account.service';
import { TaxService } from '../../services/tax.service';
import { IExpense, IIncomeExpenceType, ITypeForm } from '../../interfaces/index';


@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    NzPageHeaderModule,
    NzButtonComponent,
    NzSpaceModule,
    NzDescriptionsModule,
    NzStatisticModule,
    NzGridModule,
    NzCardModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule,
    AccountListComponent,
    AccountCardsComponent,
    NzButtonModule,
    NzDropDownModule,
    ExpenseFormComponent
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesComponent {
  public expenseService = inject(ExpenseService);
  public router = inject(Router);
  private nzNotificationService = inject(NzNotificationService);
  public accountService = inject(AccountService);
  public taxService = inject(TaxService);
  public IIncomeExpenceType = IIncomeExpenceType;

  @ViewChild(ExpenseFormComponent) form!: ExpenseFormComponent;

  public isVisible = signal(false);

  public isLoading = signal(false);

  public expense = signal<IExpense>({amount: 0});

  public expenseType: IIncomeExpenceType = IIncomeExpenceType.unique;

  public title: string = '';

  public TypeForm: ITypeForm = ITypeForm.create;

  ngOnInit(): void {
    this.expenseService.findAllSignal();
    this.accountService.findAllSignal();
    this.taxService.findAllSignal();
  }

  onCanceled(): void {
    this.isVisible.set(false);
    this.isLoading.set(false);
  }

  showModalCreate(ExpenseType: IIncomeExpenceType): void {
    this.title = ExpenseType === IIncomeExpenceType.unique ? 'Crear gasto único' : 'Crear gasto recurrente';
    this.expenseType = ExpenseType;
    this.TypeForm = ITypeForm.create;
    this.expense.set({amount: 0});
    this.isVisible.set(true);
  }

  createExpense(expense: IExpense): void {
    if (expense.tax) {
      expense.tax = {id: expense.tax.id};
    }
    this.expenseService.saveExpenseSignal(expense).subscribe({
      next: (response: any) => {
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Gasto creado exitosamente', {nzDuration: 5000});
      },
      error: (error: any) => {
        this.isLoading.set(false);
        error.error.fieldErrors?.map((fieldError: any) => {
          this.form.setControlError(fieldError.field, fieldError.message);
        });
        if (error.error.fieldErrors === undefined) {
          this.nzNotificationService.error('Lo sentimos', error.error.detail);
        }
      }
    });
  }

  updateIncome(expense: IExpense): void {}

  deleteIncome(expense: IExpense): void {}

}
