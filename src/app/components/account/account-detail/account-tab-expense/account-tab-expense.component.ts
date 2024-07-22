import {Component, inject} from '@angular/core';

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
    NzPopconfirmModule
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
}
