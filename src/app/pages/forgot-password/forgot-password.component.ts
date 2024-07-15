import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  validateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private passwordRecoveryService: PasswordRecoveryService,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { email } = this.validateForm.value;
      this.passwordRecoveryService.sendOTP(email).subscribe({
        next: () => this.message.success('OTP enviado a tu correo electrónico'),
        error: () => this.message.error('Error al enviar OTP, por favor intente más tarde')
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
