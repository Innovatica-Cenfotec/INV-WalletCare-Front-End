import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

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
import { NzModalModule } from 'ng-zorro-antd/modal';
import { IAccount, IAccountUser, ITypeForm } from '../../../../interfaces';
import { AuthService } from '../../../../services/auth.service';
import { AccountService } from '../../../../services/account.service';
import { AccountFromComponent } from "../../account-from/account-from.component";

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
        AccountFromComponent
    ],
    templateUrl: './account-detail-header.component.html',
    styleUrl: './account-detail-header.component.scss',
})
export class AccountDetailHeaderComponent implements OnChanges {


    @ViewChild(AccountFromComponent) form!: AccountFromComponent;

    @Input() id: number = 0;
    @Input() AccountsMembers: IAccountUser[] = [];
    @Input() isAccountShared: boolean = false;
    @Input() isOwner: boolean = false;

    public isMember: boolean = false;
    public accountService = inject(AccountService);

    private authService = inject(AuthService);
    private nzModalService = inject(NzModalService);
    private nzNotificationService = inject(NzNotificationService);
    private router = inject(Router);

    /**
    * The visibility of the account creation form.
    */
    public isVisible = false;

    /**
     * Indicates whether the form is loading or not.
     */
    public isLoading = false;

    /**
     * The list of account types to be displayed in the account type form.
     */
    public IITypeForm = ITypeForm;



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
    }

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
    joinAccount() {
        throw new Error('Method not implemented.');
    }
    leaveAccount() {
        throw new Error('Method not implemented.');
    }
    inviteFriend() {
        throw new Error('Method not implemented.');
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
    /**
     * Closes the account creation form.
     * Sets the `isVisible` property to `false`.
     */
    onCanceled(): void {
        this.isVisible = false;
    }

}
