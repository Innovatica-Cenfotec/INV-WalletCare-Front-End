import { Component, EventEmitter, Inject, inject, Input, OnInit, Output, signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Importing Ng-Zorro modules
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';

// Custom components
import { ICurrencyType, IUser, LoanDTO } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { NotificationDisplayComponent } from '../../notifications/notification-display/notification-display.component';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { FormModalComponent } from '../../form-modal/form-modal.component';
import { ToolsService } from '../../../services/tools.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
    selector: 'app-layout-header',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzLayoutModule,
        NzIconModule,
        NzFlexModule,
        NzDropDownModule,
        NzDrawerModule,
        NzModalModule,
        NzPopoverModule,
        NzBadgeModule,
        NzButtonModule,
        NzDividerModule,
        NzCardComponent,
        NzFormModule,
        NzInputModule,
        NzRadioModule,
        NzInputModule,
        NzInputNumberModule,
        NotificationDisplayComponent
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent extends FormModalComponent<LoanDTO> implements OnInit {
    // Services
    private authService = inject(AuthService);
    private profileService = inject(ProfileService);
    private router = inject(Router);
    private nzModalService = inject(NzModalService);
    private toolsService = inject(ToolsService);
    private nzNotificationService = inject(NzNotificationService);
    override fb = inject(FormBuilder);

    @Input() isCollapsed: boolean = false;
    @Output() toggleCollapsedEvent: EventEmitter<void> = new EventEmitter<void>()
    public user?: IUser;
    public dot = true;
    public fee: number = 0;

    ICurrency = ICurrencyType
    currencyIcon = '';
    /**
    * Boolean to display the notification popover
    * False - Hide popover.
    * True - Show popover
    */
    visibleNotifications = false;

    // FOR CALCULATOR DRAWER
    visibleCalculator = false;

    override isVisible = false;

    override isLoading = false;

    formatterPercent = (value: number): string => `${value} %`;
    parserPercent = (value: string): string => value.replace(' %', '');
    formatterDollar = (value: number): string => `$ ${value}`;
    parserDollar = (value: string): string => value.replace('$ ', '');

    /**
    * Get the form group
    */
    override formGroup = this.fb.group({
        currency: [this.item?.currecy, [Validators.required, Validators.min(0), Validators.max(1)]],
        ammount: [this.item?.ammount, [Validators.required, Validators.min(1)]],
        paymentDeadline: [this.item?.paymentDeadline, [Validators.required, Validators.min(1)]],
        interestRate: [this.item?.interestRate, [Validators.required, Validators.min(1)]]
    });

    ngOnInit(): void {
        this.user = this.authService.getUser();
        this.profileService.getUserObservable()?.subscribe(user => {
            if (user === undefined) {
                return;
            }
            if (this.user) {
                this.user.nickname = user.nickname;
            }
        });
    }



    /**
     * Toggles the collapsed state of the sidebar
     * @returns void
     */
    toggleCollapsed(): void {
        this.isCollapsed = !this.isCollapsed;
        this.toggleCollapsedEvent.emit();
    }

    /**
     * Navigates to the user profile
     * @returns void
     */
    navigateToProfile(): void {
        // Navigate to the user profile
        this.router.navigateByUrl('/app/profile');
    }

    /**
     * Logs out the user
     * @returns void
     */
    logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }

    openCalculator(): void {
        this.visibleCalculator = true;
    }

    closeCalculator(): void {
        this.visibleCalculator = false;
    }

    showModal(): void {
        this.isVisible = true;
    }

    override handleCancel() {
        this.isVisible = false;
    }

    override handleSubmit() {
        for (const key in this.formGroup.controls) {
            console.log(this.formGroup.get(key)?.value)
            if (typeof this.formGroup.get(key)?.value === 'string') {
                // Trim the string
                this.formGroup.get(key)?.setValue(this.formGroup.get(key)?.value?.trim());
            }

            // If the form control is invalid, mark it as dirty
            if (this.formGroup.get(key)?.invalid) {
                this.formGroup.get(key)?.markAsDirty();
                this.formGroup.get(key)?.updateValueAndValidity({ onlySelf: true });
            }
        }

        if (this.formGroup.invalid) {
            return;
        }

        const loan: LoanDTO = {
            currecy: this.formGroup.value.currency,
            ammount: this.formGroup.value.ammount,
            paymentDeadline: this.formGroup.value.paymentDeadline,
            interestRate: this.formGroup.value.interestRate
        }

        this.nzModalService.confirm({
            nzTitle: 'Nota: esto le dará un calculo aproximado de las cuotas a pagar por mes, para un calculo más preciso contacte con su banco.',
            nzOkText: 'Sí',
            nzOkType: 'primary',
            nzOnOk: () => {
                this.toolsService.loanCalculator(loan).subscribe({
                    next: (response: any) => {
                        this.currencyIcon = this.formGroup.value.currency === ICurrencyType.colones ? '₡' : '$';
                        this.fee = response.fee;
                    },
                    error: (error => {
                        this.nzNotificationService.error('Error', error.error.detail)
                    })
                });
            },
            nzCancelText: 'No'
        });
    }

}
