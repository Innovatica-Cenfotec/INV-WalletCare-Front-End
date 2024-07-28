import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// Importing Ng-Zorro modules
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule} from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';

// Custom elements
import { IExpense, IIncomeExpenseType, ITypeForm } from '../../interfaces/index';
import { ExpenseService } from '../../services/expense.service';
import { TaxService } from '../../services/tax.service';
import { ExpenseListComponent } from '../../components/expense/expense-list/expense-list.component';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';


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
    NzButtonModule,
    NzDropDownModule,
    ExpenseListComponent,
    ExpenseFormComponent
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesComponent implements OnInit {

  public router = inject(Router);
  public IIncomeExpenseType = IIncomeExpenseType;
  // Services
  private nzNotificationService = inject(NzNotificationService);
  private nzModalService = inject(NzModalService);
  public expenseService = inject(ExpenseService);
  public taxService = inject(TaxService);

  @ViewChild(ExpenseFormComponent) form!: ExpenseFormComponent;

  public isVisible = signal(false);
  public isLoading = signal(false);
  public expense = signal<IExpense>({amount: 0});
  public expenseType: IIncomeExpenseType = IIncomeExpenseType.unique;
  public title: string = '';
  public TypeForm: ITypeForm = ITypeForm.create;

  ngOnInit(): void {
    this.expenseService.findAllSignal();
    this.taxService.findAllSignal();
  }

  onCanceled(): void {
    this.isVisible.set(false);
    this.isLoading.set(false);
  }

  /**
   * Shows the modal to create the expense
   */
  showModalCreate(ExpenseType: IIncomeExpenseType): void {
    this.title = ExpenseType === IIncomeExpenseType.unique ? 'Crear gasto único' : 'Crear gasto recurrente';
    this.expenseType = ExpenseType;
    this.TypeForm = ITypeForm.create;
    this.expense.set({amount: 0});
    this.isVisible.set(true);
  }

  /**
   * Shows the modal to edit the expense
   */
  showModalEdit(expense: IExpense): void {
    this.title = 'Editar gasto';
    this.TypeForm = ITypeForm.update;
    this.form.item = expense;
    this.isVisible.set(true);
  }

  /**
  * Create the expense
  */
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
  
  /**
  * Edit the expense
  */
  updateExpense(expense: IExpense): void {
    this.expenseService.updateExpenseSignal(expense).subscribe({
      next: (response: any) => {
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Gasto editada exitosamente', { nzDuration: 5000 });
      },
      error: (error: any) => {
        this.isLoading.set(false);
        // Displaying the error message in the form
        error.error.fieldErrors?.map((fieldError: any) => {
          this.form.setControlError(fieldError.field, fieldError.message);
        });

        // show other errors
        if (error.error.fieldErrors === undefined) {
          this.nzNotificationService.error('Lo sentimos', error.error.detail);
        }
      }
    });
  }
  
  /**
  * Delete the expense
  */
  deleteExpense(expense: IExpense): void {
    this.nzModalService.confirm({
      nzTitle: '¿Estás seguro de que quieres eliminar la cuenta?',
      nzContent: 'Si eliminas la cuenta, se eliminarán todos los datos relacionados con ella.',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.expenseService.deleteExpenseSignal(expense.id).subscribe({
          next: () => {
            this.nzNotificationService.success('Éxito', 'La cuenta se ha eliminado correctamente');
          },
          error: (error: any) => {
            this.nzNotificationService.error('Lo sentimos', error.error.detail);
          }
        });
      },
      nzCancelText: 'No'
    });
  }
}
