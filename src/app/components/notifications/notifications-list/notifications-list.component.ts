import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject} from '@angular/core';

// Importing Ng-Zorro modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

// Custom elements
import { INotification } from '../../../interfaces';

@Component({
    selector: 'app-notifications-list',
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
    templateUrl: './notifications-list.component.html',
    styleUrl: './notifications-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsListComponent {
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
