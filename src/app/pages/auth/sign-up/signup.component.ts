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
    nickname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(2), Validators.maxLength(10)]],
    email: ['', [Validators.required, Validators.email]],
    identificationNumber: ['', [Validators.minLength(14), Validators.maxLength(16)]],
    address: ['', [Validators.maxLength(225)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    accountName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(100)]],
    accountDescription: ['', [Validators.maxLength(200)]]
  });

  public signUpError: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private form: NonNullableFormBuilder
  ) { }

  public handleSignup(): void {
    if (this.validateForm.valid) {
      let user = this.validateForm.value as any;
      let accountName = this.validateForm.value.accountName;
      let accountDescription = this.validateForm.value.accountDescription;

      this.authService.signup(user, accountName, accountDescription).subscribe({
        next: () => this.router.navigateByUrl('/app'),
        error: (err: any) => (this.signUpError = err.error.description),
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