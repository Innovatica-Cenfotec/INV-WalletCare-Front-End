import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { Router } from '@angular/router';

// Importing Ng-Zorro modules
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

// Custom elements
import { IExpense, IIncomeExpenceSavingType, ITypeForm } from '../../interfaces/index';
import { ExpenseService } from '../../services/expense.service';
import { TaxService } from '../../services/tax.service';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';
import { ExpenseListComponent } from '../../components/expense/expense-list/expense-list.component';

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
        NzPopoverModule,
        ExpenseFormComponent,
        ExpenseListComponent
    ],
    templateUrl: './expenses.component.html',
    styleUrl: './expenses.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesComponent implements OnInit {

    public router = inject(Router);
    public IIncomeExpenceType = IIncomeExpenceSavingType;
    // Services
    private nzNotificationService = inject(NzNotificationService);
    private nzModalService = inject(NzModalService);
    public expenseService = inject(ExpenseService);
    public taxService = inject(TaxService);

    @ViewChild(ExpenseFormComponent) form!: ExpenseFormComponent;

    /**
     * The visibility of the invite friend form.
     */
    public isVisible = signal(false);
    public isLoading = signal(false);
    
    /// ------- Details
    public isVisibleDetails = signal(false);

    /// ------- Details
    public isVisibleCreate = signal(false); 

    public expense = signal<IExpense>({ amount: 0 });
    public expenseType: IIncomeExpenceSavingType = IIncomeExpenceSavingType.unique;
    public title: string = '';
    public TypeForm: ITypeForm = ITypeForm.create;

    ngOnInit(): void {
      this.expenseService.findAllTemplatesSignal();
      this.taxService.findAllSignal();
    }

    closeModalForm(): void {
      this.isVisible.set(false);
      this.isLoading.set(false);
    }
    
    /**
     * Shows the modal to create the expense
     */
    showModalCreate(ExpenseType: IIncomeExpenceSavingType): void {
        this.title = ExpenseType === IIncomeExpenceSavingType.unique ? 'Crear gasto único' : 'Crear gasto recurrente';
        this.expenseType = ExpenseType;
        this.TypeForm = ITypeForm.create;
        this.expense.set({amount: 0});
        this.isVisible.set(true);
    }

    /**
     * Shows the modal to disply expense details
     */
    showModalDetails(expense: IExpense): void {
        this.nzModalService.info({
            nzTitle: 'Detalles de gasto',
            nzContent: 'Expense values: ' + expense.name,
            nzOkText: 'Sí',
            nzOkType: 'primary',
            nzOnOk: () => {
                this.expenseService.deleteExpenseSignal(expense.id).subscribe({
                    next: () => {
                        this.nzNotificationService.success('Éxito', 'El gasto se ha eliminado correctamente');
                    },
                    error: (error: any) => {
                        this.nzNotificationService.error('Lo sentimos', error.error.detail);
                    }
                });
            },
            nzCancelText: 'No'
        });
    }

    /**
     * Shows the modal to edit the expense
     */
    showModalEdit(expense: IExpense): void {
        this.title = 'Editar gasto';
        this.expenseType = expense.type ?? this.expenseType;
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
        expense.isTemplate = true;
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
            nzTitle: '¿Estás seguro de que quieres eliminar el gasto?',
            nzContent: 'Si eliminas el gasto, se eliminarán todos los datos relacionados al mismo.',
            nzOkText: 'Sí',
            nzOkType: 'primary',
            nzOnOk: () => {
                this.expenseService.deleteExpenseSignal(expense.id).subscribe({
                    next: () => {
                        this.nzNotificationService.success('Éxito', 'El gasto se ha eliminado correctamente');
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
