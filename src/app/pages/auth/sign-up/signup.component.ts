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
    identyNumber: FormControl<string>;
    address: FormControl<string>;
    password: FormControl<string>;
  }> = this.form.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    nickname: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    identyNumber: ['', [Validators.required]],
    address: ['', [Validators.required]],
    password: ['', [Validators.required]]
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

      this.authService.signup(user).subscribe({
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