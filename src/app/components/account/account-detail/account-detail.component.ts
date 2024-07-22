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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AccountFromComponent } from "../account-from/account-from.component";
import { InviteAccountComponent } from './invite-account/invite-account.component';
import { AccountDetailHeaderComponent } from "./account-detail-header/account-detail-header.component";

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
    InviteAccountComponent,
    AccountDetailHeaderComponent
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

  /*
  * Id of the account
  */
  public id: number = 0;

  public isVisibleInvite=false;

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

  countMembers(): number {
    const members = this.accountService.membersAccount$();
    if (!members) {
      return 0;
    }

    // Check if the user is a member of the account
    if (this.isOwer()) {
      return members.length + 1;
    }

    return members.length + 1;
  }

}