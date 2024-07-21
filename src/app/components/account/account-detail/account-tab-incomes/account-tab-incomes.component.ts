import {Component, inject} from '@angular/core';

// Importing Ng-Zorro modules
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzTableModule} from 'ng-zorro-antd/table';
import {DatePipe, NgIf} from "@angular/common";
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-account-tab-incomes',
  standalone: true,
  imports: [
    NzTabsModule,
    NzTableModule,
    NgIf,
    NzPopconfirmModule
  ],
  providers: [DatePipe],
  templateUrl: './account-tab-incomes.component.html',
  styleUrl: './account-tab-incomes.component.scss'
})
export class AccountTabIncomesComponent {
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