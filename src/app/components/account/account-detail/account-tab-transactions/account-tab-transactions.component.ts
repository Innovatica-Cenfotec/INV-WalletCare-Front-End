import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NzTableComponent, NzTableModule } from 'ng-zorro-antd/table';
import { IBalance, ITransaction } from '../../../../interfaces';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TransactionService } from '../../../../services/transaction.service';
import { catchError, tap } from 'rxjs';

@Component({
    selector: 'app-account-tab-transactions',
    standalone: true,
    imports: [
        CommonModule,
        NzTableModule,
        NzButtonModule,
        NzIconModule
    ],
    templateUrl: './account-tab-transactions.component.html',
    styleUrl: './account-tab-transactions.component.scss',
})
export class AccountTabTransactionsComponent{
    @Input() transactions: ITransaction[] = [];
    @Output() rollbackTransaction = new EventEmitter<ITransaction>();
    private datePipe = inject(DatePipe);
    public transactionService = inject(TransactionService); 

    /**
     * Set the date format
     * @param date is the date
     * @returns formated date dd/MM/yyyy HH:mm
     */
    getDate(date: Date | undefined): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
    }

    /**
     * Set the color for amounts
     * @param amount is the amount
     * @returns the ammount whith the feedback color
     */
    formatAmount(amount: number | undefined) {
        let style = '';
        if (amount != undefined) {
            if (amount > 0) {
                style = 'color: ' + IBalance.surplus; ';'
            } else if (amount < 0) {
                style = 'color: ' + IBalance.deficit; ';'
            } else {
                style = 'color: ' + IBalance.balance; ';'
            }
        }
        return style;
    }


    /**
     * Formats the saving type in spanish 
     * @param type is the type
     * @returns the type in spanish 
     */
    formatSavingType(type: string | undefined) {
        if (!type) {
            return '';
        }

        switch (type) {
            case 'EXPENSE':
                return 'Gasto';
            case 'SAVING':
                return 'Ahorro';
            case 'INCOME':
                return 'Ingreso';
            default:
                return '';
        }
    }
}
