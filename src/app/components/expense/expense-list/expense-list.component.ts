import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject} from '@angular/core';
import { IExpense, IIncomeExpenseType, IFrequencyType } from '../../../interfaces';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule,
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

  @Output() deleteExpense = new EventEmitter<IExpense>();
  @Output() editExpense = new EventEmitter<IExpense>();
  @Output() viewExpenseDetails = new EventEmitter<IExpense>();

  private datePipe = inject(DatePipe);

  getExpenseType(expense: IExpense): string {
    if (!expense) {
      return '';
    }
    switch (expense.type) {
      case IIncomeExpenseType.recurrence:
        return 'Recurrente';
      case IIncomeExpenseType.unique:
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

  getDate(date: Date | undefined): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }
}
