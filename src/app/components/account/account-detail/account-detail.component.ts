import { inject, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IAccount, IAccountUser, ITypeForm } from '../../../interfaces';
import { AccountService } from '../../../services/account.service';

// Importing Ng-Zorro modules
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountTabMembersComponent } from "./account-tab-members/account-tab-members.component";
import { AccountTabExpenseComponent } from "./account-tab-expense/account-tab-expense.component";
import { AccountTabIncomesComponent } from "./account-tab-incomes/account-tab-incomes.component";
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AccountFromComponent } from "../account-from/account-from.component";
import { InviteAccountComponent } from './invite-account/invite-account.component';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzDescriptionsModule,
    NzPageHeaderModule,
    NzSpaceModule,
    NzButtonComponent,
    NzDropDownModule,
    NzIconModule,
    NzTabsModule,
    NzDividerModule,
    AccountTabMembersComponent,
    AccountTabExpenseComponent,
    AccountTabIncomesComponent,
    NzModalModule,
    AccountFromComponent,
    InviteAccountComponent
  ],
  providers: [DatePipe],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss'
})
export class AccountDetailComponent implements OnInit {
  public accountService = inject(AccountService);
  private nzNotificationService = inject(NzNotificationService);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private authService = inject(AuthService);
  private nzModalService = inject(NzModalService);
  private router = inject(Router);
  /*
  * Id of the account
  */
  private id: number = 0;

  /**
  * The visibility of the account creation form.
  */
  public isVisible = false;
  public isVisibleInvite=false;

  /**
   * Indicates whether the form is loading or not.
   */
  public isLoading = false;

  /**
* The list of account types to be displayed in the account type form.
*/
  public IITypeForm = ITypeForm;

  /**
   * The list of account types to be displayed in the account type form.
   */
  @ViewChild(AccountFromComponent) form!: AccountFromComponent;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      // Validate if the id is not null or number
      if (!id || isNaN(+id)) {
        this.nzNotificationService.error('Error', 'El id de la cuenta no es válido');
        return;
      }
      this.id = Number(id);
      this.accountService.getAccountSignal(this.id).subscribe({
        next: (response: IAccount) => {
          if (this.isAccountShared()) {
            this.accountService.getMembersSignal(this.id);
          }
        },
        error: (error: any) => {
          this.nzNotificationService.error('Error', 'No se pudo obtener la cuenta');
        }
      })
    });
  }

  /**
   * Shows the date in the format dd/MM/yyyy HH:mm
   * @param date The date to format
   * @returns The date in the format dd/MM/yyyy HH:mm
   */
  getDate(date: Date | undefined): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }

  /**
   * Gets the account type
   * @param account The account object
   * @returns The account type
   */
  getAccountType(): string {
    const account = this.accountService.account$();
    if (!account) {
      return '';
    }

    switch (account.type) {
      case 'PERSONAL':
        return 'Personal';
      case 'SHARED':
        return 'Compartida';
      default:
        return '';
    }
  }

  /**
   * Checks if the account is shared
   * @param account The account object
   * @returns True if the account is shared, false otherwise
   */
  isAccountShared(): boolean {
    return this.getAccountType() === 'Compartida';
  }

  /**
   * Checks if the current user is the owner of the account
   * @param account The account object
   * @returns True if the current user is the owner, false otherwise
   */
  isOwer(): boolean {
    const account = this.accountService.account$();
    if (!account) {
      return false;
    }

    return account.owner?.id === this.authService.getUser()?.id;
  }

  /**
   * Checks if the user is a member of the account
   * @param accountUser The account user object
   * @returns True if the user is a member, false otherwise
   */
  isMember(): boolean {
    const accountUser = this.accountService.membersAccount$().find((accountUser) => accountUser.id === this.authService.getUser()?.id);
    if (!accountUser) {
      return false;
    }

    // Check if the user is a member of the account
    if (accountUser.leftAt !== null) {
      return false;
    }

    return true;
  }

  /**
   * Invites a friend to the account
   */
  inviteFriend(): void {
    this.isVisibleInvite=true;
  }
  closeInviteFriend():void{
    this.isVisibleInvite=false;
  }

  /**
   * deletes a friend from the account
   */
  deleteFriend(accountUser: IAccountUser): void {

  }

  /**
   * Leaves the account
   */
  leaveAccount(): void {

  }

  /**
   * Joins the account
   */
  joinAccount(): void {

  }

  /**
   * Deletes the account
   */
  deleteAccount(): void {
    this.nzModalService.confirm({
      nzTitle: '¿Estás seguro de que quieres eliminar la cuenta?',
      nzContent: 'Si eliminas la cuenta, se eliminarán todos los datos relacionados con ella.',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.accountService.deleteAccountSignal(this.id).subscribe({
          next: () => {
            this.nzNotificationService.success('Éxito', 'La cuenta se ha eliminado correctamente');
            this.router.navigateByUrl('app/accounts');
          },
          error: (error: any) => {
            this.nzNotificationService.error('Algo ha ido mal', error.error.detail);
          }
        });
      },
      nzCancelText: 'No'
    });
  }

  /**
   * Shows the account  form.
   * Sets the `isVisible` property to `true`.
   */
  showEditAccountForm(): void {
    this.isVisible = true;
  }

  /**
   * Edits the account
   */
  editAccount(account: IAccount): void {
    this.accountService.updateAccountSignal(account).subscribe({
      next: (response: any) => {
        this.isVisible = false;
        this.nzNotificationService.create("success", "", 'Cuenta editada exitosamente', { nzDuration: 5000 });
      },
      error: (error: any) => {
        this.isLoading = false;
        // Displaying the error message in the form
        error.error.fieldErrors?.map((fieldError: any) => {
          this.form.setControlError(fieldError.field, fieldError.message);
        });
      }
    });
  }

  countMembers(): number {
    const members = this.accountService.membersAccount$();
    if (!members) {
      return 0;
    }

    // Check if the user is a member of the account
    if (this.isOwer()) {
      return members.length+1;
    }

    return members.length
  }

  /**
   * Closes the account creation form.
   * Sets the `isVisible` property to `false`.
   */
  onCanceled(): void {
    this.isVisible = false;
  }
}