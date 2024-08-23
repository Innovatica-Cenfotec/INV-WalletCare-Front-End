import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';

// Importing Ng-Zorro modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NotificationService } from '../../../services/notification.service';

// Custom elements
import { INotification, INotificationType } from '../../../interfaces';
import { SortByOptions } from '../../../sortBy';


@Component({
    selector: 'app-notification-list',
    standalone: true,
    imports: [
        CommonModule,
        NzTableModule,
        NzDividerModule,
        NzIconModule,
        NzButtonModule,
        NzSpaceModule,
        NzModalModule,
        NzCardModule
    ],
    providers: [DatePipe, SortByOptions],
    templateUrl: './notification-list.component.html',
    styleUrl: './notification-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationListComponent {
    /**
     * Input property to accept an array of notifications to be displayed.
     */
    @Input() notificationList: INotification[] = [];

    /**
     * Input property to accept a boolean value for the modal visibility.
     * True - Show modal.
     * False - Hide modal.
     */
    @Input() showDetailsModal: boolean = false;

    /**
     * Array of notifications sorted by selected column.
     */
    sortedExpenses: INotification[] = [];

    /**
     * Output event emitter to notify when the notification details are show.
     * Emits the notification object that was selected.
     */
    @Output() detailsNotification = new EventEmitter<INotification>();

    /**
     * Output event emitter to notify when the notification is deleated.
     * Emits the notification object that was selected.
     */
    @Output() deleteNotification = new EventEmitter<INotification>();

    private datePipe = inject(DatePipe);
    public isVisible = false;
    public notification: INotification = {};
    public notificationService = inject(NotificationService);

    /**
     * Execute when component is called
     */
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


    // PAGINATION FUNCTIONS --------------------------------------------------------------------
    // Change row number with [nzPageSize] property on nx-table
    // SORT FUNCTIONS --------------------------------------------------------------------------

    /**
     * Sort notifications by title. Use toLowerCase to ignore capital letters.
     * @param a Notification a to campare with b.
     * @param b Notification b to be compared with a.
     * @returns A list ordered by notification title.
     */
    sortByTitle(a: INotification, b: INotification): number {
        return (a.title?.toLowerCase() ?? '').localeCompare(b.title?.toLowerCase() ?? '');
    }

    /**
     * Sort notifications by type.
     * @param a Notification a to campare with b.
     * @param b Notification b to be compared with a.
     * @returns A list ordered by notification type.
     */
    sortByType(a: INotification, b: INotification): number {
        return (a.type?.toString() ?? '').localeCompare(b.type?.toString() ?? '');
    }

    /**
     * Sort notifications by created date.
     * @param a Notification a to campare with b.
     * @param b Notification b to be compared with a.
     * @returns A list ordered by notification date.
     */
    sortByDate(a: INotification, b: INotification): number {
        return new Date(a.createdAt ?? new Date).getTime() - new Date(b.createdAt ?? new Date).getTime();
    }

    /**
     * shows the modal
     * @param data is the selected notification
     */
    showModal(data: INotification | undefined): void {
        if (data !== undefined) {
            this.notification = data;
        }
        this.isVisible = true;
        this.detailsNotification.emit(data);
    }

    /**
     * close the modal
     */
    handleOk(): void {
        this.isVisible = false;
    }

    /**
     * close the modal
     */
    handleCancel(): void {
        this.isVisible = false;
    }

}
