import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject} from '@angular/core';

// Importing Ng-Zorro modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

// Custom elements
import { IExpense, IIncomeExpenceSavingType, IFrequencyType, IBalance, IAmountType } from '../../../interfaces';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

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
    providers: [DatePipe],
    templateUrl: './expense-list.component.html',
    styleUrls: ['./expense-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseListComponent {
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
                return 'Unico';
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
     * Sort list of expenses by name. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by name.
     */
    sortByName(a: IExpense, b: IExpense): number {
        return (a.name?.toLowerCase() ?? '').localeCompare(b.name?.toLowerCase() ?? '');
    }

    /**
     * Sort list of expenses by description. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by decription.
     */
    sortByDescription(a: IExpense, b: IExpense): number {
        return (a.description?.toLowerCase() ?? '').localeCompare(b.description?.toLowerCase() ?? '');
    }

    /**
     * Sort list of expenses by amount. Numerical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by amount.
     */
    sortByAmount(a: IExpense, b: IExpense): number {
        return (a.amount?.toString() ?? '').localeCompare(b.amount?.toString() ?? '');
    }

    /**
     * Sort list of expenses by amount type. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by amount type.
     */
    sortByAmountType(a: IExpense, b: IExpense): number {
        return (a.amountType ?? '').localeCompare(b.amountType ?? '') ;
    }

    /**
     * Sort list of expenses by expense type. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by expense type.
     */
    sortByType(a: IExpense, b: IExpense): number {
        return (a.type ?? '').localeCompare(b.type ?? '') ;
    }

    /**
     * Sort list of expenses by frequency. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by expense frequency.
     */
    sortByFrequency(a: IExpense, b: IExpense): number {
        return (a.frequency ?? '').localeCompare(b.frequency ?? '') ;
    }

    /**
     * Sort list of expenses by scheduled day. Numerical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by scheduled day.
     */
    sortByScheduledDay(a: IExpense, b: IExpense): number {
        return (a.scheduledDay?.toString() ?? '').localeCompare(b.scheduledDay?.toString() ?? '') ;
    }

    /**
     * Sort list of expenses by account name. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by expense account name.
     */
    sortByAccount(a: IExpense, b: IExpense): number {
        return (a.account?.name ?? '').localeCompare(b.account?.name ?? '');
    }

    /**
     * Sort list of expenses by owner name. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by expense owner name.
     */
    sortByUser(a: IExpense, b: IExpense): number {
        return (a.owner?.nickname ?? '').localeCompare(b.owner?.nickname ?? '');
    }

    /**
     * Sort list of expenses by tax name. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by expense tax name.
     */
    sortByTax(a: IExpense, b: IExpense): number {
        return (a.tax?.name ?? '').localeCompare(b.tax?.name ?? '') ;
    }

    /**
     * Sort list of expenses by update date. Numerical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by update date.
     */
    sortByDate(a: IExpense, b: IExpense): number {
        return new Date(a.updatedAt ?? new Date).getTime() - new Date(b.updatedAt ?? new Date).getTime();
    }

    /**
     * Sort list of expenses by category name. Alphabetical order.
     * @param a IExpense to compare with b.
     * @param b IExpense to compare with a.
     * @returns List of expenses sorted by expense category name.
     */
    sortByCategory(a: IExpense, b: IExpense): number{
        return (a.expenseCategory?.name ?? '').localeCompare(b.expenseCategory?.name ?? '');
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
