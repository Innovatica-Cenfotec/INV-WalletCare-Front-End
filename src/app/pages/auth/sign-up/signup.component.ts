import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { IUser } from '../../../interfaces';

@Component({
  selector: 'app-signup',
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
    NzDividerModule
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent {
  public validateForm: FormGroup<{
    name: FormControl<string>;
    lastname: FormControl<string>;
    nickname: FormControl<string>;
    email: FormControl<string>;
    identificationNumber: FormControl<string>;
    address: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    accountName: FormControl<string>;
    accountDescription: FormControl<string>;
  }> = this.form.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(50)]],
    lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(50)]],
    nickname: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(2), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    identificationNumber: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(8), Validators.maxLength(16)]],
    address: ['', [Validators.maxLength(225)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+-={};':"|,.<>\/?]).{8,}$`)]],
    confirmPassword: ['', [Validators.required]],
    accountName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(100)]],
    accountDescription: ['', [Validators.maxLength(200)]]
  });

  public signUpError: string = '';
  public currenStep: number = 0;
  public previousStep: number = 0;
  public index: string = 'First-content';
  public passwordVisible = false;
  public confirmPasswordVisible = false;
  public isDisabled = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private form: NonNullableFormBuilder,
    private nzNotificationService: NzNotificationService
  ) { }

  /**
   * Validates the current step of the sign-up process.
   * Returns true if the current step is valid, otherwise returns false.
   * @returns {boolean} - Indicates whether the current step is valid or not.
   */
  validateStep(): boolean {
    let valid = true;

    if (this.currenStep === 0) {
      this.validateForm.get('name')?.setValue(this.validateForm.get('name')?.value.trim() || '');
      this.validateForm.get('lastname')?.setValue(this.validateForm.get('lastname')?.value.trim() || '');
      this.validateForm.get('nickname')?.setValue(this.validateForm.get('nickname')?.value.trim() || '');
      this.validateForm.get('identificationNumber')?.setValue(this.validateForm.get('identificationNumber')?.value.trim() || '');

      if (this.validateForm.get('name')?.invalid) {
        this.validateForm.get('name')?.markAsDirty();
        this.validateForm.get('name')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }

      if (this.validateForm.get('lastname')?.invalid) {
        this.validateForm.get('lastname')?.markAsDirty();
        this.validateForm.get('lastname')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }

      if (this.validateForm.get('nickname')?.invalid) {
        this.validateForm.get('nickname')?.markAsDirty();
        this.validateForm.get('nickname')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }

      if (this.validateForm.get('identificationNumber')?.invalid) {
        this.validateForm.get('identificationNumber')?.markAsDirty();
        this.validateForm.get('identificationNumber')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }
    }

    if (this.currenStep === 1) {
      this.validateForm.get('address')?.setValue(this.validateForm.get('address')?.value.trim() || '');
      if (this.validateForm.get('address')?.invalid) {
        this.validateForm.get('address')?.markAsDirty();
        this.validateForm.get('address')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }
    }

    if (this.currenStep === 2) {
      this.validateForm.get('accountName')?.setValue(this.validateForm.get('accountName')?.value.trim() || '');
      this.validateForm.get('accountDescription')?.setValue(this.validateForm.get('accountDescription')?.value.trim() || '');

      if (this.validateForm.get('accountName')?.invalid) {
        this.validateForm.get('accountName')?.markAsDirty();
        this.validateForm.get('accountName')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }

      if (this.validateForm.get('accountDescription')?.invalid) {
        this.validateForm.get('accountDescription')?.markAsDirty();
        this.validateForm.get('accountDescription')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }
    }

    if (this.currenStep === 3) {
      this.validateForm.get('email')?.setValue(this.validateForm.get('email')?.value.trim() || '');
      this.validateForm.get('password')?.setValue(this.validateForm.get('password')?.value.trim() || '');
      this.validateForm.get('confirmPassword')?.setValue(this.validateForm.get('confirmPassword')?.value.trim() || '');

      if (this.validateForm.get('email')?.invalid) {
        this.validateForm.get('email')?.markAsDirty();
        this.validateForm.get('email')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }

      if (this.validateForm.get('password')?.invalid) {
        this.validateForm.get('password')?.markAsDirty();
        this.validateForm.get('password')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }

      if (this.validateForm.get('confirmPassword')?.invalid) {
        this.validateForm.get('confirmPassword')?.markAsDirty();
        this.validateForm.get('confirmPassword')?.updateValueAndValidity({ onlySelf: true });
        valid = false;
      }

      // validate confirm password
      if (this.validateForm.get('password')?.value !== this.validateForm.get('confirmPassword')?.value) {
        this.validateForm.get('confirmPassword')?.setErrors({ message: 'Las contraseñas no coinciden' });
        valid = false;
      }
    }

    return valid;
  }


  pre(): void {
    this.currenStep -= 1;
  }

  next(): void {
    if (!this.validateStep()) {
      return;
    }

    this.currenStep += 1;
  }

  done(): void {
    if (!this.validateStep()) {
      return;
    }

    let user = this.validateForm.value as IUser;
    let accountName = this.validateForm.value.accountName;
    let accountDescription = this.validateForm.value.accountDescription;
    this.isDisabled = true;

    this.authService.signup(user, accountName, accountDescription).subscribe({
      next: (response: any) => {   
        this.nzNotificationService.create("success", "Cuenta creada correctamente", 'Se redirigira al inicio de sesión en 5 segundos', { nzDuration: 5000 }).onClose!.subscribe(() => {
          this.router.navigateByUrl('/app')
        });
      },
      error: (error: any) => {
        this.isDisabled = false;
        // Displaying the error message in the form
        error.error.fieldErrors?.map((fieldError: any) => {
          this.nzNotificationService.create("error", "Lo sentimos", fieldError.message);
        });

        if (error.error.detail != undefined && error.error.detail != 'Validation failed for the request') {
          this.nzNotificationService.create("error", "Error al crear la cuenta", error.error.detail);
        }
      }
    });
  }
}