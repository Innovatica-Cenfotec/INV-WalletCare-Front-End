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
    @Input() visibleNotifications = false;
    @Output() visibleNotificationsChange = new EventEmitter<boolean>();
  
    // Services
    private nzNotificationService = inject(NzNotificationService);
    private nzModalService = inject(NzModalService);
    public notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.notificationService.findAllSignal();
    }

    closeNotification(): void {
        this.visibleNotifications = false;
        this.visibleNotificationsChange.emit(this.visibleNotifications);
    }
  
    showModalDetails(notification: INotification): void {
        // Implement the logic to show notification details
    }
  
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
