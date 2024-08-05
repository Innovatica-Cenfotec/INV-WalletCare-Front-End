import { Component, inject, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Importing Ng-Zorro modules
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzIconModule } from 'ng-zorro-antd/icon';

// Custom components
import { INotification } from '../../../interfaces';
import { NotificationService } from '../../../services/notification.service';
import { NotificationListComponent } from '../notification-list/notification-list.component';

@Component({
    selector: 'app-notification-display',
    standalone: true,
    imports: [
        NzModalModule,
        NzPopoverModule,
        NzIconModule,
        NotificationListComponent
    ],
    templateUrl: './notification-display.component.html',
    styleUrl: './notification-display.component.scss'
})
export class NotificationDisplayComponent implements OnInit {
    /**
     * Input property to determine status of notification popover.
     * False - Hide popover.
     * True - Show popover.
     */
    @Input() visibleNotifications = false;

    /**
     * Output event emitter to notify when the notification is display.
     * Emits the boolean status of the notification popover.
     */
    @Output() visibleNotificationsChange = new EventEmitter<boolean>();

    // Services
    private nzNotificationService = inject(NzNotificationService);
    private nzModalService = inject(NzModalService);
    public notificationService = inject(NotificationService);
    /**
     * Execute when component is called
     */
    ngOnInit(): void {
        this.notificationService.findAllSignal();
    }

    /**
     * Close notification popover.
     */
    closeNotification(): void {
        this.visibleNotifications = false;
        this.visibleNotificationsChange.emit(this.visibleNotifications);
    }

    /**
     * Display modal with the notification details.
     * @param notification Notification body.
     */
    showModalDetails(notification: INotification): void {
        this.notificationService.markAsReadNotifSignal(notification?.id).subscribe({
            next: (response: any) => {
                console.log(response);
            },
            error: (error: any) => {
                this.nzNotificationService.error('Lo sentimos', error.error.detail);
            }
        });
    }

    /**
     * Delete a notification by its ID.
     * @param notification Notification body used to extract ID.
     */
    deleteNotification(notification: INotification): void {
        this.nzModalService.confirm({
            nzTitle: '¿Estás seguro de que quieres eliminar la notificación?',
            nzContent: 'Las notificaciones se eliminan de manera permanente.',
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
