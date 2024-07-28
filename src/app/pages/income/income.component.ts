import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Importing Ng-Zorro modules
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

import { IncomeService } from '../../services/imcome.service';
import { IIncome, IIncomeExpenseType, ITypeForm } from '../../interfaces';
import { AccountListComponent } from "../../components/account/account-list/account-list.component";
import { AccountCardsComponent } from "../../components/account/account-cards/account-cards.component";
import { IncomeFormComponent } from '../../components/income/income-form/income-form.component';
import { IncomeAllocationsComponent } from "../../components/income/income-allocations/income-allocations.component";
import { AccountService } from '../../services/account.service';
import { TaxService } from '../../services/tax.service';

@Component({
  selector: 'app-income',
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
    IncomeFormComponent,
    IncomeAllocationsComponent,
    NzButtonModule,
    NzDropDownModule
  ],
  templateUrl: './income.component.html',
  styleUrl: './income.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent {
  public incomeService = inject(IncomeService);
  public router = inject(Router);
  private nzNotificationService = inject(NzNotificationService);
  public acccountService = inject(AccountService);
  public taxService = inject(TaxService);
  public IIncomeExpenseType = IIncomeExpenseType;

  @ViewChild(IncomeFormComponent) form!: IncomeFormComponent;

  /*
  * Indicates if the modal is visible
  */
  public isVisible = signal(false);

  /*
  * Indicates if the modal is loading
  */
  public isLoading = signal(false);

  /*
  * Income to edit
  */
  public income = signal<IIncome>({ amount: 0 });

  /*
  * Income type
  */
  public incomeType: IIncomeExpenseType = IIncomeExpenseType.unique;

  /*
  * Title of the modal
  */
  public title: string = '';

  /*
  * Type of form
  */
  public TypeForm: ITypeForm = ITypeForm.create;

  ngOnInit(): void {
    this.incomeService.findAllSignal();
    this.acccountService.findAllSignal();
    this.taxService.findAllSignal();
  }

  /**
   * Close modal
   */
  onCanceled(): void {
    this.isVisible.set(false);
    this.isLoading.set(false);
  }

  /**
   * Show modal to edit income 
   * @param income income to edit
   */
  showModalEdit(income: IIncome): void {
    this.title = 'Editar ingreso';
    this.TypeForm = ITypeForm.update;
    this.income.set(income);
    this.isVisible.set(true);
  }

  /**
   * Show modal to create income 
   */
  showModalCreate(IncomeType: IIncomeExpenseType): void {
    this.title = IncomeType === IIncomeExpenseType.unique ? 'Crear ingreso único' : 'Crear ingreso recurrente';
    this.incomeType = IncomeType;
    this.TypeForm = ITypeForm.create;
    this.income.set({ amount: 0 });
    this.isVisible.set(true);
  }

  /**
   * Create or update income
   */
  createIncome(income: IIncome): void {

    if (income.tax) {
      income.tax = { id: income.tax.id };
    }

    this.incomeService.saveIncomeSignal(income).subscribe({
      next: (response: any) => {
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Ingreso creado exitosamente', { nzDuration: 5000 });
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

  deleteIncome(income: IIncome): void {

  }

  /**
  *  Update income
  * @param income income to update
  */
  updateIncome(income: IIncome): void {
    this.incomeService.updateIncomeSignal(income).subscribe({
      next: (response: any) => {
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Ingreso actualizado exitosamente', { nzDuration: 5000 });
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
   * View account details
   * @param income income to view
   */
  viewAccountDetails(income: IIncome): void {
    this.router.navigateByUrl('app/incomes/details/' + income.id);
  }
}
