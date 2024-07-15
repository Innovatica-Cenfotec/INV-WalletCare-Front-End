import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges, } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Importing Ng-Zorro modules
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { IUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzIconModule,
    NzFlexModule,
    NzDropDownModule
  ],
  templateUrl: './header-default.component.html',
  styleUrl: './header-default.component.scss'
})
export class HeaderComponent {

  constructor(
    public router: Router,
  ) { }

  /**
   * Navigates to the Login Page
   * @returns void
   */
  navigateToLogin(): void {
    // Navigate to the Login Page
    this.router.navigateByUrl('/login');
  }

   /**
   * Navigates to the Sign Up Page
   * @returns void
   */
  navigateToSignUp(): void {
    // Navigate to the Sign Up Page
    this.router.navigateByUrl('/signup');
  }

  /**
   * Navigates to the Landing Page
   * @returns void
   */
  navigaToLanding(): void {
    // Navigate to the Landing Page
    this.router.navigateByUrl('');
  }
}
