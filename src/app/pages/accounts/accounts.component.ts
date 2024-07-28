import { Component, Inject, inject, Input, OnChanges, OnInit, Signal, signal, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from "@angular/router";

// Importing Ng-Zorro modules
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';

// Importing custom components and interfaces
import { AccountFormComponent } from '../../components/account/account-form/account-form.component';
import { AccountListComponent } from '../../components/account/account-list/account-list.component'
import { IAccount, ITypeForm } from '../../interfaces';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { AccountCardsComponent } from '../../components/account/account-cards/account-cards.component';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    AccountFormComponent,
    AccountListComponent,
    AccountCardsComponent,
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
  ],
  providers: [AccountService],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {
  public accountService = inject(AccountService);
  public transactionService = inject(TransactionService);
  public router = inject(Router);
  private nzNotificationService = inject(NzNotificationService);
  private nzModalService = inject(NzModalService);

  /**
   * The visibility of the account creation form.
   */
  public isVisible = signal(false);

  /**
   * The account to be edited.
   */
  public account = signal<IAccount | undefined>(undefined);

  /**
   * The loading state of the account form.
   */
  public isLoading = signal(false);

  /**
   * The title of the account creation form.
   */
  public title = 'Crear cuenta';

  /**
   * Represents the form.
   */
  public TypeForm: ITypeForm = ITypeForm.create;

  @ViewChild(AccountFormComponent) form!: AccountFormComponent;

  /**
   * This method is called once after the component's properties have been initialized and the component
   * is ready
   */
  ngOnInit(): void {
    this.accountService.findAllSignal();
    this.transactionService.getAllByOwnerSignal();
  }

  /**
  * Closes the account creation form.
  * Sets the `isVisible` property to `false`.
  */
  onCanceled(): void {
    this.isVisible.set(false);
    this.isLoading.set(false);
  }

  /**
   * Shows the modal to edit the account
   */
  showModalEdit(account: IAccount): void {
    this.title = 'Editar cuenta';
    this.TypeForm = ITypeForm.update;
    this.form.item = account;
    this.isVisible.set(true);
  }

  /**
   * Shows the modal to create the account
   */
  showModalCreate(): void {
    this.title = 'Crear cuenta';
    this.TypeForm = ITypeForm.create;
    this.account.set(undefined);
    this.isVisible.set(true);
  }

  /**
   * Submits the account creation form.
   * Saves the account using the `accountService`.
   * Displays a success notification if the account is saved successfully.
   * Displays error messages if there are any validation errors.
   * @param item - The account data to be submitted.
   */
  createAccount(account: IAccount): void {
    this.accountService.saveAccountSignal(account).subscribe({
      next: (response: any) => {
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Cuenta creada exitosamente', { nzDuration: 5000 });
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

  updateAccount(account: IAccount): void {
    this.accountService.updateAccountSignal(account).subscribe({
      next: (response: any) => {
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Cuenta editada exitosamente', { nzDuration: 5000 });
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
  * Deletes the account
  */
  deleteAccount(account: IAccount): void {
    this.nzModalService.confirm({
      nzTitle: '¿Estás seguro de que quieres eliminar la cuenta?',
      nzContent: 'Si eliminas la cuenta, se eliminarán todos los datos relacionados con ella.',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.accountService.deleteAccountSignal(account.id).subscribe({
          next: () => {
            this.nzNotificationService.success('Éxito', 'La cuenta se ha eliminado correctamente');
            this.router.navigateByUrl('app/accounts');
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
   * Navigates to the account details page for a specific account.
   * @param account The account object whose details page is to be navigated to.
   */
  viewAccountDetails(account: IAccount): void {
    this.router.navigateByUrl('app/accounts/details/' + account.id);
  }

  /**
   * Gets the name of the default account
   * @param account The account object
   * @returns The name of the default account
   */
  getNameDefault(): string {
    const accounts = this.accountService.accounts$();
    if (!accounts || accounts.length === 0) {
      return '';
    }

    return accounts.find((account) => account.default === true)?.name || '';
  }
}
