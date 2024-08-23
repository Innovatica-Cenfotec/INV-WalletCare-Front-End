import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject} from '@angular/core';

// Importing Ng-Zorro modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

// Custom elements
import { IExpense, IIncomeExpenceSavingType, IFrequencyType, IBalance, IAmountType } from '../../../interfaces';
import { SortByOptions } from '../../../sortBy';

@Component({
    selector: 'app-expense-list',
    standalone: true,
    imports: [
        CommonModule,
        NzTableModule,
        NzDividerModule,
        NzIconModule,
        NzButtonModule,
        NzSpaceModule,
        NzTypographyModule
    ],
    providers: [DatePipe, SortByOptions],
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseListComponent {
    public sortby = inject(SortByOptions);
    /**
     * Input for expense data.
     */
    @Input() expensesList: IExpense[] = [];
    expandSet = new Set<number>();

    /**
     * List with the expenses sorted.
     */
    sortedExpenses: IExpense[] = [];

    /**
     * Output event emitter for delete expense.
     */
    @Output() deleteExpense = new EventEmitter<IExpense>();

    /**
     * Output event emitter for edit expense.
     */
    @Output() editExpense = new EventEmitter<IExpense>();

    private datePipe = inject(DatePipe);

    /**
     * Excecute when component have a change.
     */
    ngOnChanges() {
        this.sortedExpenses = [...this.expensesList];
    }

    /**
     * Get the description of an expense.
     * @param expense IExpense object.
     * @returns string value of expense description.
     */
    getExpenseDesc(expense: IExpense): string {
        if (!expense.description) {
            return '-';
        }
        return expense.description;
    }

    /**
     * Get the type of an expense.
     * @param expense IExpense object.
     * @returns string value of expense type.
     */
    getExpenseType(expense: IExpense): string {
        if (!expense) {
            return '';
        }
        switch (expense.type) {
            case IIncomeExpenceSavingType.recurrence:
                return 'Recurrente';
            case IIncomeExpenceSavingType.unique:
                return 'Único';
            default:
                return '-';
        }
    }

    /**
     * Get the frecuency of an expense.
     * @param expense IExpense object.
     * @returns string value of expense frecuency.
     */
    getExpenseFrequency(expense: IExpense): string {
        if (!expense) {
            return '-';
        }
        switch (expense.frequency) {
            case IFrequencyType.annual:
                return 'Anual';
            case IFrequencyType.monthly:
                return 'Mensual';
            case IFrequencyType.biweekly:
                return 'Quincenal';
            case IFrequencyType.weekly:
                return 'Semanal';
            case IFrequencyType.daily:
                return 'Diario';
            case IFrequencyType.other:
                return 'Personalizado';
            default:
                return '-';
        }
    }

    /**
     * Get the amount type of an expense.
     * @param expense IExpense object.
     * @returns string value of expense amount type.
     */
    getAmountType(expense: IExpense): string {
        if (!expense) {
            return '';
        }
        switch (expense.amountType) {
            case IAmountType.net :
                return 'Neto';
            case IAmountType.gross:
                return 'Bruto';
            default:
                return '-';
        }
    }

    /**
     * Get the account name of an expense.
     * @param expense IExpense object.
     * @returns string value of expense account name.
     */
    getExpenseAccount(expense: IExpense): string {
        return expense.account?.name ?? "-";
    }

    /**
     * Get the owner name of an expense.
     * @param expense IExpense object.
     * @returns string value of expense owner name.
     */
    getExpenseOwner(expense: IExpense): string {
        return expense.owner?.nickname ?? "-";
    }

    /**
     * Get the tax name of an expense.
     * @param expense IExpense object.
     * @returns string value of expense tax name.
     */
    getExpenseTax(expense: IExpense): string {
        return expense.tax?.name ?? "-";
    }

    getExpenseCategory(expense: IExpense): string { 
        return expense.expenseCategory?.name ?? "-";
    }

    /**
     * Set the date format
     * @param date is the date
     * @returns formated date dd/MM/yyyy HH:mm
     */
    getDate(date: Date | undefined): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy hh:ss') || '';
    }

    /**
     * Set the color for amounts
     * @param amount is the amount
     * @returns the ammount whith the feedback color
     */
    formatAmount(amount: number | undefined | string): string {
        isNaN(Number(amount)) ? amount = 0 : amount = Number(amount);
        amount = amount * -1;
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
     * Expand or compress details display.
     * @param id number value of the expense id.
     * @param checked Status of the displayer. True: show, False: hidden
     */
    onExpandChange(id: number | undefined, checked: boolean): void {
        if (checked) {
            this.expandSet.add(id ?? 0);
        } else {
            this.expandSet.delete(id ?? 0);
        }
    }
}
