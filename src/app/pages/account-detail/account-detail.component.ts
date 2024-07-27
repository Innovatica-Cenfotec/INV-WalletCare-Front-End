import { inject, TemplateRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountTabMembersComponent } from '../../components/account/account-detail/account-tab-members/account-tab-members.component';
import { AccountTabExpenseComponent } from '../../components/account/account-detail/account-tab-expense/account-tab-expense.component';
import { AccountTabIncomesComponent } from '../../components/account/account-detail/account-tab-incomes/account-tab-incomes.component';
import { InviteAccountComponent } from '../../components/account/account-detail/invite-account/invite-account.component';
import { AccountDetailHeaderComponent } from '../../components/account/account-detail/account-detail-header/account-detail-header.component';
import { AccountTabTransactionsComponent } from '../../components/account/account-detail/account-tab-transactions/account-tab-transactions.component';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { IAccount, IAccountType, IAccountUser, ITransaction } from '../../interfaces';

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
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';



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
    AccountTabTransactionsComponent,
    NzModalModule,
    InviteAccountComponent,
    AccountDetailHeaderComponent
  ],
  providers: [DatePipe],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss'
})
export class AccountDetailComponent implements OnInit {
  public accountService = inject(AccountService);
  public transactionService = inject(TransactionService);
  private nzNotificationService = inject(NzNotificationService);
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  private authService = inject(AuthService);
  private router = inject(Router);
  private nzModalService = inject(NzModalService);

  /*
  * Id of the account
  */
  public id: number = 0;

  ngOnInit(): void {
    this.loadData();
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
      case IAccountType.personal:
        return 'Personal';
      case IAccountType.shared:
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
   * deletes a friend from the account
   */
  deleteFriend(accountUser: IAccountUser): void {


    this.nzModalService.confirm({
      nzTitle: `¿Estás seguro de que quieres eliminar a ${accountUser.user?.nickname} (${accountUser.user?.email}) de la cuenta?`,
      nzContent: 'Si lo eliminas, perderas su colaboración y tanto sus gastos, ingresos y ahorros se eliminaran de esta cuenta.',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        const payload: IAccountUser = {
          user: {
            id: accountUser.user?.id
          },
          account: {
            id: accountUser.account?.id
          }
        }
        this.accountService.leaveSharedAccount(payload).subscribe({
          next: (response: any) => {
            this.router.navigateByUrl('/app/accounts');
            this.nzNotificationService.success('Éxito', response.message);
          },
          error: (error => {
            this.nzNotificationService.error('Error', error.error.detail)
            throw error;
          })
        });
      },
      nzCancelText: 'No'
    });


  }

  /**
   * Returns the count of members in the account.
   * @returns The count of members in the account.
   */
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

  /**
   * Handles the rollback for the transaction
   * @param transaction 
   */
  rollbackTransaction(transaction: ITransaction) {
    this.nzModalService.confirm({
      nzTitle: `¿Estás seguro de que quieres reversar esta transacción?`,
      nzContent: 'Si lo haces esta descición no puede ser desehcha. ',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.transactionService.rollbackTransaction(transaction).subscribe({
          next: (response: any) => {
            //this.router.navigateByUrl('/app/accounts');
            this.nzNotificationService.success('Éxito', 'Transacción reversada');
            this.loadData();
          },
          error: ((error: { error: { detail: string | TemplateRef<void>; }; }) => {
            this.nzNotificationService.error('Error', error.error.detail)
            throw error;
          })
        }
        );
      },
      nzCancelText: 'No'
    });
  }

  /**
   * Makes the load of all the data in the view 
   */
  loadData() {
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

      this.transactionService.getAllSignal(this.id);
    });
  }

}