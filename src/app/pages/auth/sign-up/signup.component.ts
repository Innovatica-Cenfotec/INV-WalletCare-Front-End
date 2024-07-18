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
import { concatMap } from 'rxjs';

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
    accountName: FormControl<string>;
    accountDescription: FormControl<string>;
  }> = this.form.group({
    name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(50)]],
    lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(3), Validators.maxLength(50)]],
    nickname: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*'), Validators.minLength(2), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    identificationNumber: ['', [Validators.pattern('[0-9]*'), Validators.minLength(8), Validators.maxLength(16)]],
    address: ['', [Validators.maxLength(225)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(`^[A-Za-z0-9!@#$%^&*()_+\-=\{};':"\\|,.<>\/?]*`)]],
    accountName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(100)]],
    accountDescription: ['', [Validators.maxLength(200)]]
  });

  public signUpError: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private form: NonNullableFormBuilder,
    private nzNotificationService: NzNotificationService
  ) { }

  public handleSignup(): void {
    if (this.validateForm.valid) {
      let user = this.validateForm.value as any;
      let accountName = this.validateForm.value.accountName;
      let accountDescription = this.validateForm.value.accountDescription;

      this.authService.signup(user, accountName, accountDescription).subscribe({
        next: (response: any) => {
          this.nzNotificationService.create("success", "", 'Cuenta creada correctamente, se redirigira al inicio de sesión', { nzDuration: 5000 })
          .onClose!.subscribe(() => {
            this.router.navigateByUrl('/app')
          });
        },
        error: (error: any) => {
          // Displaying the error message in the form
          error.error.fieldErrors?.map((fieldError: any) => {
            this.setControlError(fieldError.field, fieldError.message);
          });
          if(error.error.detail != undefined) {
            this.nzNotificationService.create("error", "", error.error.detail, { nzDuration: 5000 });
          }
        }
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
  /**
     * Sets an error for a specific form control.
     * @param nameField - The name of the form control.
     * @param nameError - The error message.
     */
  setControlError(nameField: string, message: string): void {
    const control = this.validateForm.get(nameField);
    if (control) {
        control.setErrors({ message });
    }
}
}