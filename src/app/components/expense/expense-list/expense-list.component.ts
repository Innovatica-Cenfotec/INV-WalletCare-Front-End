import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject} from '@angular/core';
import { FormsModule } from '@angular/forms'; 

// Importing Ng-Zorro modules
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

// Custom elements
import { IExpense, IIncomeExpenceType, IFrequencyType, IBalance } from '../../../interfaces';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzSpaceModule,
    NzToolTipModule
  ],
  providers: [DatePipe],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseListComponent {
  @Input() expensesList: IExpense[] = [];
  @Input() showAccount: boolean = false;
  @Input() showOwner: boolean = false;
  sortedExpenses: IExpense[] = [];
  filteredExpenses: IExpense[] = [];

  filters = {
    name: '',
    amount: '',
    type: '',
    user: '',
    date: ''
  };

  @Output() deleteExpense = new EventEmitter<IExpense>();
  @Output() editExpense = new EventEmitter<IExpense>();
  @Output() viewExpenseDetails = new EventEmitter<IExpense>();

  private datePipe = inject(DatePipe);

  ngOnChanges() {
    this.sortedExpenses = [...this.expensesList];
    this.applyFilters();
  }

  getExpenseType(expense: IExpense): string {
    if (!expense) {
      return '';
    }
    switch (expense.type) {
      case IIncomeExpenceType.recurrence:
        return 'Recurrente';
      case IIncomeExpenceType.unique:
        return 'Unico';
      default:
        return '';
    }
  }

  getExpenseFrecuency(expense: IExpense): string {
    if (!expense) {
      return '';
    }
    switch (expense.frequency) {
      case IFrequencyType.annual:
        return 'Anual';
      case IFrequencyType.monthly:
        return 'Mensual';
      case IFrequencyType.weekly:
        return 'Semanal';
      case IFrequencyType.daily:
        return 'Diario';
      case IFrequencyType.other:
        return 'Otro';
      default:
        return '-';
    }
  }

  getExpenseAccount(expense: IExpense): string {
    return expense.account?.name ?? "-";
  }

  getExpenseOwner(expense: IExpense): string {
    return expense.user?.nickname ?? "-";
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

  // Sort by attribute
  sortByName(a: IExpense, b: IExpense): number {
    return (a.name?.toLowerCase() ?? '').localeCompare(b.name?.toLowerCase() ?? '');
  }

  sortByDescription(a: IExpense, b: IExpense): number {
    return (a.description?.toLowerCase() ?? '').localeCompare(b.description?.toLowerCase() ?? '');
  }

  sortByAmount(a: IExpense, b: IExpense): number {
    //if (parseInt(b.amount) > parseInt(a.amount)) return 1;
    //else if (parseInt(b.amount) < parseInt(a.amount)) return -1;
    //else return 0;
    return (a.amount?.toString() ?? '').localeCompare(b.amount?.toString() ?? '');
  }

  sortByType(a: IExpense, b: IExpense): number {
    return (a.type?.toString() ?? '').localeCompare(b.type?.toString() ?? '') ;
  }

  sortByAccount(a: IExpense, b: IExpense): number {
    return (a.account?.name ?? '').localeCompare(b.account?.name ?? '');
  }

  sortByUser(a: IExpense, b: IExpense): number {
    return (a.user?.nickname ?? '').localeCompare(b.user?.nickname ?? '');
  }

  sortByDate(a: IExpense, b: IExpense): number {
    return new Date(a.updatedAt ?? new Date).getTime() - new Date(b.updatedAt ?? new Date).getTime();
  }

  // Filter
  applyFilters(): void {
    this.filteredExpenses = this.sortedExpenses.filter(expense => {
      return (!this.filters.name || expense.name?.toLowerCase().includes(this.filters.name.toLowerCase())) &&
             (!this.filters.amount || expense.amount?.toString().includes(this.filters.amount)) &&
             (!this.filters.type || this.getExpenseType(expense).toLowerCase().includes(this.filters.type.toLowerCase())) &&
             (!this.filters.user || (expense.user?.nickname ?? '').toLowerCase().includes(this.filters.user.toLowerCase())) &&
             (!this.filters.date || this.getDate(expense.updatedAt).includes(this.filters.date));
    });
  }
}
