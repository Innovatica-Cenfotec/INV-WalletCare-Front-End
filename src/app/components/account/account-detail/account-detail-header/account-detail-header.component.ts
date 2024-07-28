import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild, signal, ChangeDetectionStrategy } from '@angular/core';

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
import { IAccount, IAccountUser, IExpense, IIncomeExpenceType, ITypeForm } from '../../../../interfaces';
import { AuthService } from '../../../../services/auth.service';
import { AccountService } from '../../../../services/account.service';
import { InviteAccountComponent } from "../invite-account/invite-account.component";
import { AccountFormComponent } from '../../account-form/account-form.component';
import { ExpenseService } from '../../../../services/expense.service';
import { TaxService } from '../../../../services/tax.service';
import { ExpenseFormComponent } from '../../../expense/expense-form/expense-form.component';

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
        ExpenseFormComponent
    ],
    templateUrl: './account-detail-header.component.html',
    styleUrl: './account-detail-header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailHeaderComponent implements OnChanges {


    @ViewChild(AccountFormComponent) form!: AccountFormComponent;

    @ViewChild(ExpenseFormComponent) formExpense!: ExpenseFormComponent;

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

    /**
     * Indicates whether the user is a member of the account.
     */
    public isMember: boolean = false;

    public expense = signal<IExpense>({ amount: 0 });

    public expenseType: IIncomeExpenceType = IIncomeExpenceType.unique;

    public title: string = '';

    public TypeForm: ITypeForm = ITypeForm.create;

    /**
    * The visibility of the account edit form.
    */
    public isVisible = signal(false);

    /**
     * The visibility of the invite friend form.
     */
    public isVisibleInvite = false;

    /**
     * Indicates whether the form is loading or not.
     */
    public isLoading = signal(false);

    /**
     * The list of account types to be displayed in the account type form.
     */
    public IITypeForm = ITypeForm;


    public accountService = inject(AccountService);
    public expenseService = inject(ExpenseService);
    public taxService = inject(TaxService);
    public IIncomeExpenceType = IIncomeExpenceType;
    private authService = inject(AuthService);
    private nzModalService = inject(NzModalService);
    private nzNotificationService = inject(NzNotificationService);
    private router = inject(Router);
    private member: IAccountUser | undefined = {};

    ngOnInit(): void {
        this.expenseService.findAllSignal();
        this.accountService.findAllSignal();
        this.taxService.findAllSignal();
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

        if (changes['id']) {
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
        this.isVisible.set(true);
    }

    /**
     * Joins the account.
     */
    joinAccount() {
        throw new Error('Method not implemented.');
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
    * Edits the account
    */
    editAccount(account: IAccount): void {
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
            }
        });
    }

    /**
     * Closes the form.
     */
    onCanceled(): void {
        this.isVisible.set(false);
        this.isLoading.set(false);
    }

    /**
     * Invites a friend to the account
     */
    inviteFriend(): void {
        this.isVisibleInvite = true;
    }

    /**
     * Closes the invite friend form..
     */
    closeInviteFriend(): void {
        this.isVisibleInvite = false;
    }

    showModalCreate(ExpenseType: IIncomeExpenceType): void {
        this.title = ExpenseType === IIncomeExpenceType.unique ? 'Crear gasto único' : 'Crear gasto recurrente';
        this.expenseType = ExpenseType;
        this.TypeForm = ITypeForm.create;
        this.expense.set({ amount: 0 });
        this.isVisible.set(true);
    }

    createExpense(expense: IExpense): void {
        const payload: IAccount = {
            id: this.id
        }

        if (expense.tax) {
            expense.tax = { id: expense.tax.id };
        }

        expense.account = payload;

        this.expenseService.saveExpenseSignal(expense).subscribe({
            next: (response: any) => {
                this.isVisible.set(false);
                this.nzNotificationService.create("success", "", 'Gasto creado exitosamente', { nzDuration: 5000 });
            },
            error: (error: any) => {
                this.isLoading.set(false);
                error.error.fieldErrors?.map((fieldError: any) => {
                    this.form.setControlError(fieldError.field, fieldError.message);
                });
                if (error.error.fieldErrors === undefined) {
                    this.nzNotificationService.error('Lo sentimos', error.error.detail);
                }
            }
        });
    }

    updateIncome(expense: IExpense): void { }

    deleteIncome(expense: IExpense): void { }
}
