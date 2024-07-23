import { ISendInvite } from './../../../../interfaces/index';
import { error } from '@ant-design/icons-angular';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Router, ActivatedRoute } from '@angular/router';
import { IFeedBackMessage, IFeedbackStatus } from '../../../../interfaces';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpaceComponent } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AccountService } from '../../../../services/account.service';

@Component({
    selector: 'app-invite-account',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzCardModule,
        NzAlertModule,
        NzDividerModule,
        NzSpaceComponent,
        NzModalModule
    ],
    templateUrl: './invite-account.component.html',
    styleUrl: './invite-account.component.scss',
})
export class InviteAccountComponent implements OnInit {
    private fb = inject(FormBuilder);
    private message = inject(NzNotificationService);
    private route = inject(ActivatedRoute);
    private accountService = inject(AccountService);    
    public inviteForm!: FormGroup;
    private accountId: number | null = null;
    public isDisabled: boolean = false;
    @Input() isVisible: boolean = true;
    @Output() onClose = new EventEmitter<void>();

    /**
     * Initializes the component, sets up the invite form and retrieves the account ID from the URL.
     */
    ngOnInit(): void {
        this.inviteForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
        // Get the account ID from the URL
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            this.accountId = id ? +id : null;  // Convert to number if exists
            console.log('ID de cuenta extraído de la URL:', this.accountId);  // Debug message
        });
    }

    /**
     * Sends the invitation if the form is valid and the account ID is available.
     */
    sendInvite(): void {
        if (this.inviteForm.valid && this.accountId !== null) {
            this.isDisabled = true;
            this.inviteForm.disable();

            const { email } = this.inviteForm.value;
            this.accountService.sendInvite(email, this.accountId).subscribe({
                next: () => {
                    this.closeModel();
                    this.message.success('Invitación enviada correctamente', 'El usuario recibirá un correo con la invitación a la cuenta')
                },
                error: (error) => {
                    this.inviteForm.enable();
                    this.isDisabled = false;
                    this.message.error('Lo sentimos', error.error.detail);
                }
            });
        } else {
            Object.values(this.inviteForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

    /**
     * Closes the modal.
     */
    closeModel(): void {
        this.inviteForm.reset();
        this.inviteForm.enable();
        this.isDisabled = false;
        this.isVisible = false;
        this.onClose.emit();
    }
}
