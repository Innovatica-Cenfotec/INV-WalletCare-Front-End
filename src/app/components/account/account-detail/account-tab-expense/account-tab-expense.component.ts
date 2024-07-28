import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../../../../services/expense.service';
import { ExpenseListComponent } from '../../../expense/expense-list/expense-list.component';
import { IExpense } from '../../../../interfaces';

@Component({
  selector: 'app-account-tab-expense',
  standalone: true,
  imports: [CommonModule, ExpenseListComponent],
  providers: [DatePipe],
  templateUrl: './account-tab-expense.component.html',
  styleUrls: ['./account-tab-expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountTabExpenseComponent implements OnInit {
  public expenseService = inject(ExpenseService);
  private route = inject(ActivatedRoute);
  private accountId: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = +params['id'];
    });

    this.expenseService.filterByAccountSignal(this.accountId);
  }
}
