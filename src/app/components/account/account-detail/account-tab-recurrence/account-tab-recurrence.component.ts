import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

// Importing Ng-Zorro modules
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DatePipe } from "@angular/common";
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { IExpense, IIncome, IRecurrence } from '../../../../interfaces';
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
                    item: recurrence.expense as IExpense,
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
}
