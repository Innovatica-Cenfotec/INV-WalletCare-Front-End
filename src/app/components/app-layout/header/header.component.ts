import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges,  } from '@angular/core';
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
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Input() isCollapsed: boolean = false;  
  @Output() toggleCollapsedEvent: EventEmitter<void> = new EventEmitter<void>()
  public user?: IUser;
  
  constructor(
    public router: Router,
    public authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.user = this.authService.getUser();
  }
  
  /**
   * Toggles the collapsed state of the sidebar
   * @returns void
   */
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggleCollapsedEvent.emit();
  }

  /**
   * Navigates to the user profile
   * @returns void
   */
  navigateToProfile(): void {
    // Navigate to the user profile
    this.router.navigateByUrl('/app/profile');
  }

  /**
   * Logs out the user
   * @returns void
   */
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');   
  }
}
