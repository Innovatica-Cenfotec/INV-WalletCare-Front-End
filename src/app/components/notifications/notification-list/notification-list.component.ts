import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject} from '@angular/core';

// Importing Ng-Zorro modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

// Custom elements
import { INotification, INotificationType } from '../../../interfaces';

@Component({
    selector: 'app-notification-list',
    standalone: true,
    imports: [
        CommonModule,
        NzTableModule,
        NzDividerModule,
        NzIconModule,
        NzButtonModule,
        NzSpaceModule
    ],
    providers: [DatePipe],
    templateUrl: './notification-list.component.html',
    styleUrl: './notification-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent {
    @Input() notificationList: INotification[] = [];
    @Input() showDetailsModal: boolean = false;

    // Sort and filter lists
    sortedExpenses: INotification[] = [];

    @Output() detailsNotification = new EventEmitter<INotification>();
    @Output() readNotification = new EventEmitter<INotification>();
    @Output() deleteNotification = new EventEmitter<INotification>();

    private datePipe = inject(DatePipe);

    ngOnChanges() {
        this.sortedExpenses = [...this.notificationList];
    }
    
    /**
     * Get type of notification.
     * @param notification Notification object.
     * @returns String with type of notification.
     */
    getNotificationType(notification: INotification): string {
        if (!notification) {
            return '-';
        }
        switch (notification.type) {
            case INotificationType.achievement:
                return 'Logro';
            case INotificationType.account_status:
                return 'Estado de cuenta';
            case INotificationType.goal:
                return 'Meta';
            case INotificationType.tip:
                return 'Consejo';
            default:
                return '-';
        }
    }
    
    /**
     * Set the date format
     * @param date is the date
     * @returns formated date dd/MM/yyyy HH:mm
     */
    getDate(date: Date | undefined): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy hh:ss') || '';
    }


    // SORT FUNCTIONS

    sortByTitle(a: INotification, b: INotification): number {
        return (a.title?.toLowerCase() ?? '').localeCompare(b.title?.toLowerCase() ?? '');
    }
    
    sortByType(a: INotification, b: INotification): number {
        return (a.type?.toString() ?? '').localeCompare(b.type?.toString() ?? '');
    }

    sortByDate(a: INotification, b: INotification): number {
        return new Date(a.updatedAt ?? new Date).getTime() - new Date(b.updatedAt ?? new Date).getTime();
    }
}
