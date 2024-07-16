import { Component, inject, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

// Importing Ng-Zorro modules
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationService } from 'ng-zorro-antd/notification';


// Importing custom components and interfaces
import { AccountFromComponent } from '../../components/account/account-from/account-from.component';
import { IAccount, IAccountType, ITypeForm } from '../../interfaces';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzButtonComponent,
    NzSpaceModule,
    NzDescriptionsModule,
    NzStatisticModule,
    NzGridModule,
    AccountFromComponent
  ],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  private accountService = inject(AccountService);
  private NzNotificationService = inject(NzNotificationService);

  public isVisible = false;
  public isLoading = false;
  public title = 'Create Account';
  public IITypeForm = ITypeForm;

  @ViewChild(AccountFromComponent) form!: AccountFromComponent;

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
  onSubmitted(item: IAccount): void {
    this.accountService.saveAccountSignal(item).subscribe({
      next: (response: any) => {
        this.isVisible = false;
        this.NzNotificationService.create("success", "", 'Account created successfully', { nzDuration: 5000 });
      },
      error: (error: any) => {
        // Displaying the error message in the form
        error.error.fieldErrors?.map((fieldError: any) => {
          this.form.setControlError(fieldError.field, fieldError.message);
        });
      }
    });
  }
}
