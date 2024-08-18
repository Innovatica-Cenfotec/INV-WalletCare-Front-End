import { CommonModule } from '@angular/common';
import { Component, inject } from "@angular/core";

// Importing Ng-Zorro modules
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';

// CUSTOM COMPONENT
import { BarchartComponent } from '../../components/chart/barchart/barchart.component';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/imcome.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    BarchartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
    public expenseService = inject(ExpenseService);
    public incomeService = inject(IncomeService);

    monthOrder = ['ene', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 
      'aug', 'sep', 'oct', 'nov', 'dic'];
    
    chartExpense = this.expenseService.reportAnualAmountByCategory();

    chartIncome = this.incomeService.reportAnualAmountByCategory();
}
