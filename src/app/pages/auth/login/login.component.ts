import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';

// Importing Ng-Zorro modules
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { StatusService } from '../../../services/status.service';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ForgotPasswordComponent } from '../../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzCheckboxModule,
    NzTypographyModule,
    NzDividerModule,
    NzMessageModule,
    NzAlertModule,
    NzModalModule,
    ForgotPasswordComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private statusService = inject(StatusService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private message = inject(NzMessageService);
  public isVisible=false;
  //private modal = inject(NzModalService);

  /**
   * This is the error message that will be displayed if the login fails
   */
  isLoggingIn = false;

  /**
   * This is the error message that will be displayed if the login fails
   */
  loginError: string | null = null;

  /**
   * This is the visibility of the password
   */
  public passwordVisible = false;

  /**
   * This is the form group that we will use to validate the form    *
   */
  validateForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    // Check the server status
    this.statusService.checkServerStatus().then(status => {
      if (!status)
        this.message.error('El servidor no está disponible en este momento, por favor intente más tarde', { nzDuration: 0 });
    });
  }

  public handleLogin(): void {

    if (this.validateForm.valid) {
      let credentials = this.validateForm.value as { email: string, password: string };
      this.isLoggingIn = true;
      this.authService.login(credentials).subscribe({
        next: () => this.router.navigateByUrl('/app'),
        error: (err: any) => {
          if (err.status === 401) {
            this.loginError = 'Usuario o contraseña incorrectos';
          } else {
            this.loginError = 'Ocurrió un error inesperado, por favor intente más tarde';
          }
          this.isLoggingIn = false
        },
       
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
  public forgotPassowrd(): void {
    this.isVisible=true;
    /*this.modal.create({
      nzTitle: 'Recuperar Contraseña',
      nzContent: ForgotPasswordComponent,
      nzFooter:null
    })*/
  }
  public closeModal(): void {
    this.isVisible=false;
  }
}