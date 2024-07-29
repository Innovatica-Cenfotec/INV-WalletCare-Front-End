import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

// Importing Ng-Zorro modules
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DatePipe } from "@angular/common";
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { IBalance, IExpense, IIncome, IRecurrence } from '../../../../interfaces';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-account-tab-recurrence',
    standalone: true,
    imports: [
        CommonModule,
        NzTabsModule,
        NzTableModule,
        NzPopconfirmModule,
        NzButtonModule,
        NzIconModule
    ],
    providers: [DatePipe],
    templateUrl: './account-tab-recurrence.component.html',
    styleUrl: './account-tab-recurrence.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountTabRecurrenceComponent implements OnChanges {
    private datePipe = inject(DatePipe);

    @Input() type: 'income' | 'expense' | undefined;
    @Input() recurrences: IRecurrence[] = [];
    @Output() deleteRecurrence = new EventEmitter<any>();

    /*
    * List of recurrences to show in the table
    */
    showTable: {
        id: number;
        item: IIncome | IExpense
        type: 'income' | 'expense'
    }[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['recurrences']) {
            if (this.type === 'income') {
                this.showTable = this.recurrences.map((recurrence) => ({
                    id: recurrence.id!,
                    item: recurrence.income as IIncome,
                    type: 'income'
                }));
            }

            if (this.type === 'expense') {
                this.showTable = this.recurrences.map((recurrence) => ({
                    id: recurrence.id!,
                    item: this.formatAmmount(recurrence.expense),
                    type: 'expense'
                }));
            }
        }
    }

    /**
   * Shows the date in the format dd/MM/yyyy HH:mm
   * @param date The date to format
   * @returns The date in the format dd/MM/yyyy HH:mm
   */
    getDate(date: Date | undefined): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
    }

    formatAmmount(expense: IExpense | undefined): IExpense {
        let returnExpense: IExpense = {};

        if (expense !== undefined &&  expense.amount !== undefined) {
            returnExpense = expense;
            let ammount: number = + expense.amount;
            let calc: number = -Math.abs(ammount);
            returnExpense.amount = calc.toString();
            
        }

        return returnExpense;
    }

    /**
     * Set the color for amounts
     * @param amount is the amount
     * @returns the ammount whith the feedback color
     */
    formatAmount(amount: string | 0 | undefined): string{
                
        let style = '';
        if (amount != undefined) {
            let ammountNumber : number = + amount;
            if (ammountNumber > 0) {
                style = 'color: ' + IBalance.surplus; ';'
            } else if (ammountNumber < 0) {
                style = 'color: ' + IBalance.deficit; ';'
            } else {
                style = 'color: ' + IBalance.balance; ';'
            }
        }
        return style;
    }
}
