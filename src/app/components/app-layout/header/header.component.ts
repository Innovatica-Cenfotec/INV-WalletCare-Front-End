import { Component, EventEmitter, inject, Input, OnInit, Output  } from '@angular/core';
import { Router } from '@angular/router';

// Importing Ng-Zorro modules
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

// Custom components
import { IUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { NotificationDisplayComponent } from '../../notifications/notification-display/notification-display.component';

@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzIconModule,
    NzFlexModule,
    NzDropDownModule,
    NzDrawerModule,
    NzModalModule,
    NzPopoverModule,
    NzBadgeModule,
    NotificationDisplayComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    // Services
    private authService = inject(AuthService);
    private profileService = inject(ProfileService);
    private router = inject(Router);

    @Input() isCollapsed: boolean = false;  
    @Output() toggleCollapsedEvent: EventEmitter<void> = new EventEmitter<void>()
    public user?: IUser;
    public dot = true;
    ngOnInit(): void {
        this.user = this.authService.getUser();
        this.profileService.getUserObservable()?.subscribe(user => {
            if (user === undefined) {
                return;
            }
            if (this.user) {
                this.user.nickname = user.nickname;
            }
        });
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

    // FOR CALCULATOR DRAWER
    visibleCalculator = false;

    openCalculator(): void {
        this.visibleCalculator = true;
    }

    closeCalculator(): void {
        this.visibleCalculator = false;
    }

    /**
     * Boolean to display the notification popover
     * False - Hide popover.
     * True - Show popover
     */
    visibleNotifications = false;
}
