import { Component, Inject, inject, Input, OnChanges, OnInit, Signal, signal, SimpleChanges, ViewChild } from '@angular/core';

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

// Importing custom components and interfaces
import { AccountFromComponent } from '../../components/account/account-from/account-from.component';
import { AccountListComponent } from '../../components/account/account-list/account-list.component'
import { IAccount, ITypeForm } from '../../interfaces';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { AccountCardsComponent } from '../../components/account/account-cards/account-cards.component';
import { Router } from "@angular/router";

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    AccountFromComponent,
    AccountListComponent,
    AccountCardsComponent,
    NzPageHeaderModule,
    NzButtonComponent,
    NzSpaceModule,
    NzDescriptionsModule,
    NzStatisticModule,
    NzGridModule,
    NzCardModule,
    NzIconModule
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {
  public accountService = inject(AccountService);
  public router = inject(Router);
  private NzNotificationService = inject(NzNotificationService);

  /**
   * The visibility of the account creation form.
   */
  public isVisible = false;

  /**
   * The title of the account creation form.
   */
  public title = 'Crear cuenta';

  /**
   * The list of account types to be displayed in the account type form.
   */
  public IITypeForm = ITypeForm;

  /*
   * The list of accounts to be displayed in the account list.
   */
  private accountList: IAccount[] = [];

  /**
   * The list of account types to be displayed in the account type form.
   */
  @ViewChild(AccountFromComponent) form!: AccountFromComponent;

  ngOnInit(): void {
    this.accountService.findAllSignal();
  }

  /**
   * Opens the account creation form.
   * Sets the `isVisible` property to `true`.
   */
  createAccount(): void {
    this.isVisible = true;
  }

  /**
   * Closes the account creation form.
   * Sets the `isVisible` property to `false`.
   */
  onCanceled(): void {
    this.isVisible = false;
  }

  /**
   * Submits the account creation form.
   * Saves the account using the `accountService`.
   * Displays a success notification if the account is saved successfully.
   * Displays error messages if there are any validation errors.
   * @param item - The account data to be submitted.
   */
  onCreated(item: IAccount): void {
    this.accountService.saveAccountSignal(item).subscribe({
      next: (response: any) => {
        this.isVisible = false;
        this.NzNotificationService.create("success", "", 'Cuenta creada exitosamente', { nzDuration: 5000 });
      },
      error: (error: any) => {
        // Displaying the error message in the form
        error.error.fieldErrors?.map((fieldError: any) => {
          this.form.setControlError(fieldError.field, fieldError.message);
        });
      }
    });
  }

  /**
   * Navigates to the account details page for a specific account.
   * @param account The account object whose details page is to be navigated to.
   */
  viewAccountDetails(account: IAccount): void {
    this.router.navigateByUrl('app/accounts/details/' + account.id);
  }
}


