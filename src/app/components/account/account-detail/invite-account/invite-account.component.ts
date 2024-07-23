import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SendInviteService } from '../../../../services/send-invitation.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Router, ActivatedRoute } from '@angular/router';
import { IFeedBackMessage, IFeedbackStatus } from '../../../../interfaces';
import { error } from '@ant-design/icons-angular';

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
    ],
    templateUrl: './invite-account.component.html',
    styleUrl: './invite-account.component.scss',
})
export class InviteAccountComponent implements OnInit {
    private fb = inject(FormBuilder);
    private message = inject(NzMessageService);
    private route = inject(ActivatedRoute);
    public inviteService = inject(SendInviteService);
    public inviteForm!: FormGroup;
    feedbackMessage: IFeedBackMessage = { type: IFeedbackStatus.default, message: '' };
    private accountId: number | null = null;
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
            const { email } = this.inviteForm.value;
            this.inviteService.sendInvite(email, this.accountId).subscribe({
                next: () => this.message.success('Invitación enviada correctamente'),
                error: () => this.message.error('Hubo un error con la invitación, verifique que el usuario ya esté registrado y no sea un miembro activo de la cuenta')
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
}
