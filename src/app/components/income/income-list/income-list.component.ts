import { CommonModule,DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Inject, inject,Component, EventEmitter, Input, Output } from '@angular/core';
import {IAmountType, IIncome, IIncomeExpenceType} from '../../../interfaces';
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
    selector: 'app-income-list',
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
    templateUrl: './income-list.component.html',
    styleUrl: './income-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeListComponent { 
    @Input() incomeList:IIncome[]=[];
    @Output() viewIncomeDetails=new EventEmitter<IIncome>();
    @Output() deleteIncome=new EventEmitter<IIncome>();
    @Output() editIncome=new EventEmitter<IIncome>();
    public datePipe = inject(DatePipe);



    getAmountType(income: IIncome): string {
        if (!income) {
          return '';
        }
    
        switch (income.amountType) {
          case IAmountType.gross:
            return 'Bruto';
          case IAmountType.net:
            return 'Neto';
          default:
            return '';
        }
    }
    getIncomeType(income:IIncome):string{
        if (!income) {
            return '';
          }
      
          switch (income.type) {
            case IIncomeExpenceType.recurrence:
              return 'Recurrente';
            case IIncomeExpenceType.unique:
              return 'Único';
            default:
              return '';
          }
    }
    formatDate(date: Date | string | null | undefined): string {
        return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
    }
}