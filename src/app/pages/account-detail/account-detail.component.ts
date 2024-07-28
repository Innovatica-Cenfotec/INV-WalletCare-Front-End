import { inject } from '@angular/core';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Importing Ng-Zorro modules
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ActivatedRoute } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CommonModule, DatePipe } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';

// Custom elements
import { AccountService } from '../../services/account.service';
import { ExpenseService } from '../../services/expense.service';
import { IExpense, IIncomeExpenseType, ITypeForm } from '../../interfaces/index';
import { InviteAccountComponent } from '../../components/account/account-detail/invite-account/invite-account.component';
import { AccountDetailHeaderComponent } from '../../components/account/account-detail/account-detail-header/account-detail-header.component';
import { AuthService } from '../../services/auth.service';
import { AccountTabMembersComponent } from '../../components/account/account-detail/account-tab-members/account-tab-members.component';
import { AccountTabIncomesComponent } from '../../components/account/account-detail/account-tab-incomes/account-tab-incomes.component';
import { IAccount, IAccountType, IAccountUser } from '../../interfaces';
import { ExpenseListComponent } from '../../components/expense/expense-list/expense-list.component';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';

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
    AccountTabIncomesComponent,
    ExpenseListComponent,
    ExpenseFormComponent,
    NzModalModule,
    InviteAccountComponent,
    AccountDetailHeaderComponent
  ],
  providers: [DatePipe],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss'
})
export class AccountDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  public router = inject(Router);
  // Services
  private authService = inject(AuthService);
  private nzModalService = inject(NzModalService);
  public accountService = inject(AccountService);
  public expenseService = inject(ExpenseService);
  private nzNotificationService = inject(NzNotificationService);

  @ViewChild(ExpenseFormComponent) formExpense: ExpenseFormComponent = new ExpenseFormComponent;
  public title: string = '';
  public TypeForm: ITypeForm = ITypeForm.create;

  /*
  * Id of the account
  */
  public id: number = 0;
  
  /**
   * The visibility of the account creation form.
   */
  public isVisible = signal(false);

  /**
   * The loading state of the account form.
   */
  public isLoading = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      // Validate if the id is not null or number
      if (!id || isNaN(+id)) {
        this.nzNotificationService.error('Error', 'El id de la cuenta no es válido');
        return;
      }

      this.id = Number(id);
      // Get the account by id and get the members if the account is shared
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
    
    this.route.params.subscribe(params => {
      this.id = +params['id']; // '+' is used to convert the string to a number
      // Fetch account details and expenses based on the id
      this.expenseService.filterByAccountSignal(this.id);
    });
  }
  
  /**
  * Closes the expense creation form.
  * Sets the `isVisible` property to `false`.
  */
  onCanceled(): void {
    this.isVisible.set(false);
    this.isLoading.set(false);
  }
  
  /**
   * Shows the modal to edit the expense
   */
  showModalEditExpense(expense: IExpense): void {
    this.title = 'Editar gasto';
    this.TypeForm = ITypeForm.update;
    console.log(this.formExpense); // Log the value
    this.formExpense.item = expense;
    console.log("Item property works perfectly."); // print if actual modal display
    this.isVisible.set(true);
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
  isOwner(): boolean {
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
    if (this.isOwner()) {
      return members.length + 1;
    }

    return members.length + 1;
  }

    
  /**
  * Deletes the expense
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