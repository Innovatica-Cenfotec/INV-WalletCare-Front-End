import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormItemComponent, NzFormModule } from 'ng-zorro-antd/form';
import { IForgotResetPassword } from '../../interfaces';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-forgot-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzInputModule,
    NzButtonModule,
    NzDividerModule,
    NzFormModule,
    NzFormItemComponent,
    NzModalModule,
    NzIconModule
  ],
  templateUrl: './forgot-password-reset.component.html',
  styleUrls: ['./forgot-password-reset.component.scss']
})
export class ForgotPasswordResetComponent implements OnInit {
  validateForm: FormGroup;
  email: string = ''; // Inicializado con valor por defecto

  /**
   * This is the visibility of the password
   */
  public passwordVisible = false;

  /**
   * This is the visibility of the confirm password
   */
  public confirmPasswordVisible = false;
  @Input() className = 'forgot-password-reset-container';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private passwordRecoveryService: PasswordRecoveryService,
    private message: NzMessageService,
    private router: Router,
    private authService: AuthService
  ) {
    this.validateForm = this.fb.group({
      otp: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    });    
  }

  ngOnInit(): void {
    // Get email from query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  submitForm(): void {
    if(this.className==''){
      this.validateForm.get('otp')?.clearValidators();
      this.validateForm.get('otp')?.updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      const forgotPasswordReset = this.validateForm.value as IForgotResetPassword;
      forgotPasswordReset.email = this.email;
      const { newPassword, confirmPassword } = this.validateForm.value;

      if (newPassword !== confirmPassword) {
        this.message.error('Las contraseñas no coinciden, intente de nuevo');
        return;
      }
      if (this.className == '') {
        this.passwordRecoveryService.changePassword(forgotPasswordReset).subscribe({
          next:()=>{
            this.message.success('Contraseña actualizada correctamente, inicie sesión con su nueva contraseña');
            this.authService.logout();
            this.router.navigate(['/login']); // Redirige al inicio de sesión
          },
          error:(error)=>{
            this.message.error('Error al cambiar la contraseña, porfavor intente más tarde')
            console.error('Error',error)
          }

        })
      } else {

        this.passwordRecoveryService.resetPassword(forgotPasswordReset).subscribe({
          next: (response) => {
            console.log('Success response:', response); // Depuración de respuesta
            this.message.success('Contraseña actualizada correctamente');
            this.router.navigate(['/login']); // Redirige al inicio de sesión
          },
          error: (err) => {
            console.log('Error response:', err); // Depuración de error
            this.message.error('Error al actualizar la contraseña, por favor intente más tarde')
          }
        });
      }
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
