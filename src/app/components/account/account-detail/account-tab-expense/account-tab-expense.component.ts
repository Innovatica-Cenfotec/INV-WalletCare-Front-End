import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { IExpense, IIncomeExpenceType, IFrequencyType } from '../../../../interfaces/index';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

// Importing Ng-Zorro modules
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzTableModule} from 'ng-zorro-antd/table';
import {DatePipe, NgIf} from "@angular/common";
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-account-tab-expense',
  standalone: true,
  imports: [
    NzTabsModule,
    NzTableModule,
    NgIf,
    NzPopconfirmModule,
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
  templateUrl: './account-tab-expense.component.html',
  styleUrl: './account-tab-expense.component.scss'
})
export class AccountTabExpenseComponent {
  private datePipe = inject(DatePipe);

  /**
   * Shows the date in the format dd/MM/yyyy HH:mm
   * @param date The date to format
   * @returns The date in the format dd/MM/yyyy HH:mm
   */
  getDate(date: Date | undefined): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }
  
  /**
   * Input property to accept an array of expenses to be displayed.
   */
  @Input() expensesList: IExpense[] = [];

  /**
   * Output event emitter to notify when an expense needs to be deleted.
   * Emits the expense object that was selected.
   */
  @Output() deleteExpense = new EventEmitter<IExpense>();

  /**
   * Output event emitter to notify when an expense needs to be edited.
   * Emits the expense object that was selected.
   */
  @Output() editExpense = new EventEmitter<IExpense>();

  /**
   * Output event emitter to notify when details of a specific expense need to be viewed.
   * Emits the expense object that was selected.
   */
  @Output() viewExpenseDetails = new EventEmitter<IExpense>();


  /**
 * Gets the expense type
 * @param expense The expense
 * @returns The expense type
 */
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

  getExpenseOwner(expense: IExpense): string {
    return expense.user?.nickname ?? "-";
  }
}
