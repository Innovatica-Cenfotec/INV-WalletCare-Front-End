import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from "@angular/core";

// Importing Ng-Zorro modules
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

// CUSTOM COMPONENT
import { BarchartComponent } from '../../components/chart/barchart/barchart.component';
import { ExpenseService } from '../../services/expense.service';
import { IncomeService } from '../../services/imcome.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzCardModule,
    NzGridModule,
    NzPopoverModule,
    BarchartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  
    public expenseService = inject(ExpenseService);
    public incomeService = inject(IncomeService);

    monthOrder = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 
      'ago', 'sep', 'oct', 'nov', 'dic'];
    
    /**
     * Execute when component is called
     */
    ngOnInit(): void {
        this.expenseService.reportAnualAmountByCategory(new Date().getFullYear());
        this.incomeService.reportAnualAmountByCategory(new Date().getFullYear());
    }
}
