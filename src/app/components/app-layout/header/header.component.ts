import { Component, EventEmitter, inject, Input, OnInit, Output  } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Importing Ng-Zorro modules
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzNotificationService } from 'ng-zorro-antd/notification';

// Custom components
import { INotification, IUser } from '../../../interfaces';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { NotificationsListComponent } from '../../notifications/notifications-list/notifications-list.component';
import { NotificationService } from '../../../services/notification.service';

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
    NotificationsListComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
    // Services
    private nzNotificationService = inject(NzNotificationService);
    private nzModalService = inject(NzModalService);
    private authService = inject(AuthService);
    private profileService = inject(ProfileService);
    public notificationService = inject(NotificationService);
    private router = inject(Router);

    @Input() isCollapsed: boolean = false;  
    @Output() toggleCollapsedEvent: EventEmitter<void> = new EventEmitter<void>()
    public user?: IUser;
      
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
        this.notificationService.findAllSignal();
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

    // FOR NOTIFICATION DRAWER
    visibleNotifications = false;

    openNotifications(): void {
        this.visibleNotifications = true;
    }

    closeNotifications(): void {
        this.visibleNotifications = false;
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
    * Display details of the notification
    */
    showModalDetails(notification: INotification): void {}
    
    /**
    * Delete the notification
    */
    deleteNotification(notification: INotification): void {
        this.nzModalService.confirm({
            nzTitle: '¿Estás seguro de que quieres eliminar la notificación?',
            nzContent: 'Las notificaciones se eliminan para siempre.',
            nzOkText: 'Sí',
            nzOkType: 'primary',
            nzOnOk: () => {
                this.notificationService.deleteNotificationSignal(notification.id).subscribe({
                    next: () => {
                        this.nzNotificationService.success('Éxito', 'La notificación se ha eliminado correctamente');
                    },
                    error: (error: any) => {
                        this.nzNotificationService.error('Lo sentimos', error.error.detail);
                    }
                });
            },
            nzCancelText: 'No'
        });
    }
}
