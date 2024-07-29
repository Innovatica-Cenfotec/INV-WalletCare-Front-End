import { inject, OnChanges, SimpleChanges, TemplateRef, ViewChild, signal } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AccountTabMembersComponent } from '../../components/account/account-detail/account-tab-members/account-tab-members.component';
import { InviteAccountComponent } from '../../components/account/account-detail/invite-account/invite-account.component';
import { AccountDetailHeaderComponent } from '../../components/account/account-detail/account-detail-header/account-detail-header.component';
import { AccountTabTransactionsComponent } from '../../components/account/account-detail/account-tab-transactions/account-tab-transactions.component';
import { TransactionService } from '../../services/transaction.service';
import { AccountService } from '../../services/account.service';
import { AuthService } from '../../services/auth.service';
import { IAccount, IAccountType, IAccountUser, IBalance, IRecurrence, ITransaction, IExpense, IIncomeExpenseType, ITypeForm, } from '../../interfaces';
import { AccountTabRecurrenceComponent } from '../../components/account/account-detail/account-tab-recurrence/account-tab-recurrence.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseListComponent } from '../../components/expense/expense-list/expense-list.component';
import { ExpenseFormComponent } from '../../components/expense/expense-form/expense-form.component';


// Importing Ng-Zorro modules
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { RecurrenceService } from '../../services/recurrence.service';


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
    NzModalModule,
    NzTabsModule,
    NzDividerModule,
    AccountTabMembersComponent,
    AccountTabTransactionsComponent,
    NzModalModule,
    InviteAccountComponent,
    AccountDetailHeaderComponent,
    AccountTabRecurrenceComponent,
    AccountTabTransactionsComponent,
    AccountDetailHeaderComponent,
    ExpenseListComponent,
    ExpenseFormComponent,
    InviteAccountComponent
  ],
  providers: [DatePipe],
  templateUrl: './account-detail.component.html',
  styleUrl: './account-detail.component.scss'
})

export class AccountDetailComponent implements OnInit, OnChanges {
  public accountService = inject(AccountService);
  public transactionService = inject(TransactionService);
  public recurrenceService = inject(RecurrenceService);

  public generalBalance: number | undefined;
  public generalExpenses = 0;
  public monthExpenses = 0;
  public monthIncomes = 0;
  public recurringExpenses = 0;
  public recurringIncomes = 0;

  private nzNotificationService = inject(NzNotificationService);

  private route = inject(ActivatedRoute);
  private datePipe = inject(DatePipe);
  public router = inject(Router);
  // Services
  private nzModalService = inject(NzModalService);
  private authService = inject(AuthService);
  public expenseService = inject(ExpenseService);

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

  // Expenses modal
  @ViewChild(ExpenseFormComponent) formExpense!: ExpenseFormComponent;
  public expenseType: IIncomeExpenseType = IIncomeExpenseType.unique;
  public title: string = '';
  public TypeForm: ITypeForm = ITypeForm.create;

  ngOnInit(): void {
    this.loadData();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

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
      });
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


  ngOnChanges(changes: SimpleChanges): void {
    let monthExp: number;
    if (changes['generalBalance']) {
      this.transactionService.transactions$().forEach(element => {
        if (element.createdAt?.getMonth == new Date().getMonth) {
          if (element.amount !== undefined) {
            monthExp = monthExp + element.amount;
          }
        }
      });


    }
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

  deleteRecurrence(recurrence: any): void {
    const type = recurrence.type === 'income' ? 'ingreso' : 'gasto';

    this.nzModalService.confirm({
      nzTitle: type === 'gasto' ? `¿Estás seguro de que quieres eliminar este gasto recurrente?` : `¿Estás seguro de que quieres eliminar este ingreso recurrente?`,
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.recurrenceService.deleteRecurrenceSignal(recurrence.id).subscribe({
          next: (response: any) => {
            this.nzNotificationService.success('Éxito', type === 'gasto' ? 'Se ha eliminado el gasto recurrente con éxito' : 'Se ha eliminado el ingreso recurrente con éxito');
            this.loadData();
          },
          error: (error => {
            this.nzNotificationService.error('Error', error.error.detail)
          })
        });
      },
      nzCancelText: 'No'
    });
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
            this.loadData();
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
    if (this.isOwner()) {
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
          this.generalBalance = response.balance;

          if (this.isAccountShared()) {
            this.accountService.getMembersSignal(this.id);
          }
        },
        error: (error: any) => {
          this.nzNotificationService.error('Error', 'No se pudo obtener la cuenta');
        }
      })

      this.recurrenceService.findAllSignal(this.id);
      this.transactionService.getAllSignal(this.id);
      this.transactionService.getBalancesByAccount(this.id).subscribe({
        next: (response: any) => {
          this.monthExpenses = response.monthlyExpenseBalance;
          this.recurringExpenses = response.recurrentExpensesBalance;
          this.monthIncomes = response.monthlyIncomeBalance;
          this.recurringIncomes = response.recurrentIncomesBalance;
        }
      });
    });
  }

  /**
  * Deletes the expense
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