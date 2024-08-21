import { TransactionFormComponent } from './../../../transaction-form/transaction-form.component';
import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild, signal, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

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
import { NzModalService } from 'ng-zorro-antd/modal';
import { IAccount, IAccountUser, IExpense, IIncome, IIncomeExpenceSavingType, ISaving, ITypeForm } from '../../../../interfaces';
import { AuthService } from '../../../../services/auth.service';
import { AccountService } from '../../../../services/account.service';
import { InviteAccountComponent } from "../invite-account/invite-account.component";
import { AccountFormComponent } from '../../account-form/account-form.component';
import { ExpenseService } from '../../../../services/expense.service';
import { TaxService } from '../../../../services/tax.service';
import { ExpenseFormComponent } from '../../../expense/expense-form/expense-form.component';
import { IncomeService } from '../../../../services/imcome.service';
import { IncomeFormComponent } from '../../../income/income-form/income-form.component';
import { SavingFormComponent } from '../../../saving/saving-form/saving-form.component';
import { SavingService } from '../../../../services/saving.service';
import { CategoryService } from '../../../../services/category.service';

@Component({
    selector: 'app-account-detail-header',
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
        AccountFormComponent,
        InviteAccountComponent,
        NzDropDownModule,
        ExpenseFormComponent,
        IncomeFormComponent,
        TransactionFormComponent,
        SavingFormComponent
    ],
    templateUrl: './account-detail-header.component.html',
    styleUrl: './account-detail-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailHeaderComponent implements OnChanges {
    @ViewChild(AccountFormComponent) form!: AccountFormComponent;
    @ViewChild(ExpenseFormComponent) formExpense!: ExpenseFormComponent;
    @ViewChild(IncomeFormComponent) formIncome!: IncomeFormComponent;
    @ViewChild(SavingFormComponent) formSaving!: SavingFormComponent;

    /*
    * The account id.
    */
    @Input() id: number = 0;

    /**
     * Represents the list of account users.
     */
    @Input() AccountsMembers: IAccountUser[] = [];

    /**
     * Indicates whether the account is shared or not.
     */
    @Input() isAccountShared: boolean = false;

    /**
     * Indicates whether the user is the owner of the account.
     */
    @Input() isOwner: boolean = false;

    @Output() loadData = new EventEmitter<void>();


    /**
     * Indicates whether the user is a member of the account.
     */
    public isMember: boolean = false;

    /**
    * The visibility of the account edit form.
    */
    public isVisibleEditAccount = signal(false);

    /**
     * The visibility of the invite friend form.
     */
    public isVisibleInvite = false


    /// ------- General
    public IITypeForm = ITypeForm;
    public isLoading = signal(false);
    public TypeForm: ITypeForm = ITypeForm.create;
    public title: string = '';
    public incomeExpenceSavingType: IIncomeExpenceSavingType = IIncomeExpenceSavingType.unique;

    /// ------- Expense
    public expense = signal<IExpense>({ amount: 0 });
    public isVisibleExpense = signal(false);

    /// ------- Income
    public isVisibleIncome = signal(false);
    public income = signal<IExpense>({ amount: 0 });

    /// ------- Saving
    public isVisibleSaving = signal(false);
    public saving = signal<ISaving>({ amount: 0 });

    /**
     * The transaction form type.
     */
    public TransactionFormType: 'income' | 'expense' | 'saving' = 'income';

    /**
     * The visibility of the transaction form.
     */
    public isVisibleTransaction = false;

    /**
     * Indicates whether the transaction form is loading or not.
     */
    public isLoadingTransaction = false;

    public incomeService = inject(IncomeService);
    public accountService = inject(AccountService);
    public expenseService = inject(ExpenseService);
    public savingService = inject(SavingService);
    public taxService = inject(TaxService);
    public CategoryService = inject(CategoryService);
    public IIncomeExpenceType = IIncomeExpenceSavingType;
    private authService = inject(AuthService);
    private nzModalService = inject(NzModalService);
    private nzNotificationService = inject(NzNotificationService);
    private router = inject(Router);
    private member: IAccountUser | undefined = {};

    ngOnInit(): void {
        this.expenseService.findAllSignal();
        this.accountService.findAllSignal();
        this.taxService.findAllSignal();
        this.incomeService.findAllSignal();
        this.savingService.findAllSignal();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['AccountsMembers']) {
            let accountUser = this.AccountsMembers.find((accountUser) => accountUser.id === this.authService.getUser()?.id);

            if (!accountUser) {
                this.isMember = false;
            }

            // Check if the user is a member of the account
            if (accountUser?.invitationStatus !== 2) {
                this.isMember = false;
            }

            this.isMember = true;
        }

        if (changes['id'] && this.isAccountShared) {
            this.accountService.getMembersSignal(this.id);
            this.member = this.accountService.membersAccount$().find((accountUser) => accountUser.id === this.authService.getUser()?.id);
        }
    }

    /**
     * Deletes the account.
     * Displays a confirmation modal and deletes the account if the user confirms.
     */
    deleteAccount() {
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
                        this.nzNotificationService.error('Lo sentimos', error.error.detail);
                    }
                });
            },
            nzCancelText: 'No'
        });
    }

    /**
     * Deletes the account if i leave it before 
     */
    deleteAccountUser() {

    }

    /**
     * Shows the account  form.
     */
    showEditAccountForm(): void {
        this.isVisibleEditAccount.set(true);
    }

    /**
     * Leaves the account.
     */
    leaveAccount() {
        this.nzModalService.confirm({
            nzTitle: `¿Estás seguro de que quieres salirte de la la cuenta? `,
            nzContent: 'Si sales la cuenta, perderás los gastos, ingresos y ahorros que tus amigos compartían contigo.',
            nzOkText: 'Sí',
            nzOkType: 'primary',
            nzOnOk: () => {
                const payload: IAccountUser = {
                    user: {
                        id: this.authService.getUser()?.id
                    },
                    account: {
                        id: this.accountService.account$()?.id
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
     * Invites a friend to the account
     */
    inviteFriend(): void {
        this.isVisibleInvite = true;
    }

    /**
     * Shows the transaction form.
     */
    addSelectedTransaction(item: IIncome | IExpense | ISaving): void {
        item.owner = undefined;
        item.account = {
            id: this.id
        }

        // check if the item has a tax and set the tax id
        if ('tax' in item && item.tax) {
            item.tax = { id: item.tax.id };
        }

        // check if the item has a category and set the category id
        if ('expenseCategory' in item && item.expenseCategory) {
            item.expenseCategory = { id: item.expenseCategory.id };
        }

        if (this.TransactionFormType === 'income') {
            this.incomeService.addIncomeToAccountSignal(item).subscribe({
                next: (response: any) => {
                    if (item.type === IIncomeExpenceSavingType.unique) {
                        this.nzNotificationService.create("success", "", 'Ingreso agregado exitosamente', { nzDuration: 5000 });
                    }
                    else {
                        this.nzNotificationService.create("success", "", 'Ingreso recurrente agregado exitosamente, se agregará a las transacciones futuras según la configuración', { nzDuration: 10000 });
                    }
                    this.isVisibleTransaction = false;
                    this.loadData.emit();
                },
                error: (error: any) => {
                    this.nzNotificationService.error('Lo sentimos', error.error.detail);
                }
            });
        }
        if (this.TransactionFormType === 'expense') {
            this.expenseService.addExpenseToAccountSignal(item).subscribe({
                next: (response: any) => {
                    if (item.type === IIncomeExpenceSavingType.unique) {
                        this.nzNotificationService.create("success", "", 'Gasto agregado exitosamente', { nzDuration: 5000 });
                    }
                    else {
                        this.nzNotificationService.create("success", "", 'Gasto recurrente agregado exitosamente, se agregará a las transacciones futuras según la configuración', { nzDuration: 10000 });
                    }
                    this.isVisibleTransaction = false;
                    this.loadData.emit();
                },
                error: (error: any) => {
                    this.nzNotificationService.error('Lo sentimos', error.error.detail);
                }
            });
        }
        if (this.TransactionFormType === 'saving') {
            this.savingService.addSavingToAccountSignal(item).subscribe({
                next: (response: any) => {
                    if (item.type === IIncomeExpenceSavingType.unique) {
                        this.nzNotificationService.create("success", "", 'Ahorro agregado exitosamente', { nzDuration: 5000 });
                    }
                    else {
                        this.nzNotificationService.create("success", "", 'Ahorro recurrente agregado exitosamente, seagregará a las transacciones futuras según la configuración.', { nzDuration: 10000 });
                    }
                    this.isVisibleTransaction = false;
                    this.loadData.emit();
                },
                error: (error: any) => {
                    this.nzNotificationService.error('Lo sentimos', error.error.detail);
                    this.isLoadingTransaction = false;
                }
            });
        }
    }

    /**
     * Shows the transaction form.
     */
    showTransactionForm(type: 'income' | 'expense' | 'saving'): void {
        this.isVisibleTransaction = true;
        this.TransactionFormType = type;
    }

    /**
     * Shows the income or expense form.
     * @param incomeOrExpenseType The income or expense
     */
    showModalIncomeOrExpense(incomeOrExpenseType: IIncomeExpenceSavingType): void {
        if (this.TransactionFormType === 'income') {
            // Show the income form
            this.title = incomeOrExpenseType === IIncomeExpenceSavingType.unique ? 'Crear ingreso único' : 'Crear ingreso recurrente';
            this.incomeExpenceSavingType = incomeOrExpenseType;
            this.TypeForm = ITypeForm.create;
            this.income.set({ amount: 0 });
            this.isVisibleIncome.set(true);
        } else if (this.TransactionFormType === 'saving') {
            this.title = incomeOrExpenseType === IIncomeExpenceSavingType.unique ? 'Crear ahorro único' : 'Crear ahorro recurrente';
            this.incomeExpenceSavingType = incomeOrExpenseType;
            this.TypeForm = ITypeForm.create;
            this.saving.set({ amount: 0 } as ISaving);
            this.isVisibleSaving.set(true);
        } else {
            //  Show the expense form
            this.title = incomeOrExpenseType === IIncomeExpenceSavingType.unique ? 'Crear gasto único' : 'Crear gasto recurrente';
            this.incomeExpenceSavingType = incomeOrExpenseType;
            this.TypeForm = ITypeForm.create;
            this.expense.set({ amount: 0 });
            this.isVisibleExpense.set(true);
        }
    }

    /**
    * Edits the account
    */
    editAccount(account: IAccount): void {
        this.accountService.updateAccountSignal(account).subscribe({
            next: (response: any) => {
                this.isVisibleEditAccount.set(false);
                this.nzNotificationService.create("success", "", 'Cuenta editada exitosamente', { nzDuration: 5000 });
            },
            error: (error: any) => {
                this.isLoading.set(false);
                // Displaying the error message in the form
                error.error.fieldErrors?.map((fieldError: any) => {
                    this.form.setControlError(fieldError.field, fieldError.message);
                });
            }
        });
    }

    /**
     * Create expense
     * @param expense expense to create
     */
    createExpense(expense: IExpense): void {
        const payload: IAccount = {
            id: this.id
        }

        if (expense.tax) {
            expense.tax = { id: expense.tax.id };
        }

        if (expense.expenseCategory) {
            expense.expenseCategory = { id: expense.expenseCategory.id };
        }

        expense.addTransaction = true;
        expense.account = payload;
        this.expenseService.saveExpenseSignal(expense).subscribe({
            next: (response: any) => {
                this.isVisibleExpense.set(false);
                if (this.incomeExpenceSavingType === IIncomeExpenceSavingType.unique) {
                    this.nzNotificationService.create("success", "", 'Gasto agregado exitosamente', { nzDuration: 5000 });
                }
                else {
                    this.nzNotificationService.create("success", "", 'Gasto recurrente agregado exitosamente, se agregará a las transacciones futuras según la configuración', { nzDuration: 10000 });
                }
                this.loadData.emit();
            },
            error: (error: any) => {
                error.error.fieldErrors?.map((fieldError: any) => {
                    this.formExpense.setControlError(fieldError.field, fieldError.message);
                });
                if (error.error.fieldErrors === undefined) {
                    this.nzNotificationService.error('Lo sentimos', error.error.detail);
                }
                this.isLoading.set(false);
            }
        });
    }

    /**
     * Create income
     * @param income income to create
     */
    createIncome(income: IIncome): void {
        const payload: IAccount = {
            id: this.id
        }

        if (income.tax) {
            income.tax = { id: income.tax.id };
        }

        income.addTransaction = true;
        income.account = payload;
        this.incomeService.saveIncomeSignal(income).subscribe({
            next: (response: any) => {
                this.isVisibleIncome.set(false);
                if (this.incomeExpenceSavingType === IIncomeExpenceSavingType.unique) {
                    this.nzNotificationService.create("success", "", 'Ingreso agregado exitosamente', { nzDuration: 5000 });
                }
                else {
                    this.nzNotificationService.create("success", "", 'Ingreso recurrente agregado exitosamente, se agregará a las transacciones futuras según la configuración', { nzDuration: 10000 });
                }
                this.loadData.emit();
            },
            error: (error: any) => {
                // Displaying the error message in the form
                error.error.fieldErrors?.map((fieldError: any) => {
                    this.formIncome.setControlError(fieldError.field, fieldError.message);
                });

                // show other errors
                if (error.error.fieldErrors === undefined) {
                    this.nzNotificationService.error('Lo sentimos', error.error.detail);
                }

                this.isLoading.set(false);
            }
        });
    }

    /**
     * Create saving
     * @param saving saving to create
     */
    createSaving(saving: ISaving): void {
        const payload: IAccount = {
            id: this.id
        }

        saving.addTransaction = true;
        saving.account = payload;

        this.savingService.saveSavingSignal(saving).subscribe({
            next: (response: any) => {
                this.isVisibleSaving.set(false);
                if (this.incomeExpenceSavingType === IIncomeExpenceSavingType.unique) {
                    this.nzNotificationService.create("success", "", 'Ahorro agregado exitosamente', { nzDuration: 5000 });
                }
                else {
                    this.nzNotificationService.create("success", "", 'Ahorro recurrente agregado exitosamente, se agregará a las transacciones futuras según la configuración', { nzDuration: 10000 });
                }
                this.loadData.emit();
            },
            error: (error: any) => {
                // Displaying the error message in the form
                error.error.fieldErrors?.map((fieldError: any) => {
                    this.formSaving.setControlError(fieldError.field, fieldError.message);
                });

                // show other errors
                if (error.error.fieldErrors === undefined) {
                    this.nzNotificationService.error('Lo sentimos', error.error.detail);
                }

                this.isLoading.set(false);
            }
        });
    }

    /**
     * Close the income or expense form.
     */
    closeModalIncomeOrExpense(): void {
        this.isVisibleIncome.set(false);
        this.isVisibleExpense.set(false);
        this.isVisibleSaving.set(false);
    }

    /**
     * Close the modal.
     */
    closeModal(): void {
        this.isVisibleEditAccount.set(false);
        this.isVisibleInvite = false;
        this.isVisibleTransaction = false;
    }
}