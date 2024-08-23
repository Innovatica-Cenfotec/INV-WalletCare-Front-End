import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Importing Ng-Zorro modules
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

import { IncomeService } from '../../services/imcome.service';
import { IIncome, IIncomeExpenceSavingType, ITypeForm } from '../../interfaces';
import { IncomeFormComponent } from '../../components/income/income-form/income-form.component';
import { IncomeAllocationsComponent } from "../../components/income/income-allocations/income-allocations.component";
import { AccountService } from '../../services/account.service';
import { TaxService } from '../../services/tax.service';
import { IncomeListComponent } from '../../components/income/income-list/income-list.component';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [
    CommonModule,
    NzPageHeaderModule,
    NzButtonModule,
    NzSpaceModule,
    NzIconModule,
    NzModalModule,
    NzDropDownModule,
    NzPopoverModule,
    IncomeListComponent,
    IncomeFormComponent,
    IncomeAllocationsComponent
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
  public IIncomeExpenceType = IIncomeExpenceSavingType;

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
  public incomeType: IIncomeExpenceSavingType = IIncomeExpenceSavingType.unique;

  /*
  * Title of the modal
  */
  public title: string = '';
  public nzModalService = inject(NzModalService)
  /*
  * Type of form
  */
  public TypeForm: ITypeForm = ITypeForm.create;

  ngOnInit(): void {
    this.incomeService.findAllTemplatesSignal();
    this.acccountService.findAllSignal();
    this.taxService.findAllSignal();
  }

  /**
   * Close modal
   */
  onCanceled(): void {
    this.income.set({ amount: 0 });
    this.isVisible.set(false);
    this.isLoading.set(false);
  }

  /**
   * Show modal to edit income 
   * @param income income to edit
   */
  showModalEdit(income: IIncome): void {
    this.title = 'Editar ingreso';
    this.incomeType = income.type || IIncomeExpenceSavingType.unique;
    this.TypeForm = ITypeForm.update;
    this.income.set(income);
    this.isVisible.set(true);
  }

  /**
   * Show modal to create income 
   */
  showModalCreate(IncomeType: IIncomeExpenceSavingType): void {
    this.title = IncomeType === IIncomeExpenceSavingType.unique ? 'Crear ingreso único' : 'Crear ingreso recurrente';
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

    income.addTransaction
    this.incomeService.saveIncomeSignal(income).subscribe({
      next: (response: any) => {
        this.income.set({ amount: 0 });
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Ingreso creado exitosamente', { nzDuration: 5000 });
      },
      error: (error: any) => {
        // Displaying the error message in the form
        error.error.fieldErrors?.map((fieldError: any) => {
          this.form.setControlError(fieldError.field, fieldError.message);
        });

        // show other errors
        if (error.error.fieldErrors === undefined) {
          this.nzNotificationService.error('Lo sentimos', error.error.detail);
        }

        this.form.stopLoading();
      }
    });
  }

  deleteIncome(income: IIncome): void {
    this.nzModalService.confirm({
      nzTitle: '¿Estás seguro de que quieres eliminar el ingreso?',
      nzContent: 'Si eliminas el ingreso, se eliminarán todos los datos relacionados con el.',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.incomeService.deleteIncomeSignal(income.id).subscribe({
          next: () => {
            this.nzNotificationService.success('Éxito', 'El ingreso se ha eliminado correctamente');
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
  *  Update income
  * @param income income to update
  */
  updateIncome(income: IIncome): void {

    if (income.tax) {
      income.tax = { id: income.tax.id };
    }

    this.incomeService.updateIncomeSignal(income).subscribe({
      next: (response: any) => {
        this.income.set({ amount: 0 });
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Ingreso actualizado exitosamente', { nzDuration: 5000 });
      },
      error: (error: any) => {
        // Displaying the error message in the form
        error.error.fieldErrors?.map((fieldError: any) => {
          this.form.setControlError(fieldError.field, fieldError.message);
        });

        // show other errors
        if (error.error.fieldErrors === undefined) {
          this.nzNotificationService.error('Lo sentimos', error.error.detail);
        }

        this.form.stopLoading();
      }
    });
  }
}
