import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IAccount, IAccountUser } from "../../../../interfaces";
import { CommonModule, DatePipe } from "@angular/common";

// Importing Ng-Zorro modules
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgIf } from "@angular/common";
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SortByOptions } from '../../../../sortBy';

@Component({
    selector: 'app-account-tab-members',
    standalone: true,
    imports: [
        CommonModule,
        NzTabsModule,
        NzTableModule,
        NgIf,
        NzPopconfirmModule,
        NzButtonModule,
        NzIconModule
    ],
    providers: [DatePipe, SortByOptions],
    templateUrl: './account-tab-members.component.html',
    styleUrl: './account-tab-members.component.scss'
})
export class AccountTabMembersComponent {
    private datePipe = inject(DatePipe);
    public sortby = inject(SortByOptions);
    @Input() account: IAccount | undefined;
    @Input() accountUsers: IAccountUser[] = [];
    @Input() isOwner: boolean = false;
    @Output() deleteFriend = new EventEmitter<IAccountUser>();

    /**
     * Shows the date in the format dd/MM/yyyy HH:mm
     * @param date The date to format
     * @returns The date in the format dd/MM/yyyy HH:mm
     */
    getDate(date: Date | undefined): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
    }

    /**
     * Gets the account type
     * @returns The account type
     * @param accountUser
     */
    getStatus(accountUser: IAccountUser): string {
        switch (accountUser.invitationStatus) {
            case 1:
                return 'Pendiente';
            case 2:
                return 'Aceptado';
            case 3:
                return 'Rechazado';
            default:
                return 'Desconocido';
        }
    }
}
