import { CommonModule,DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Inject, inject,Component, EventEmitter, Input, Output } from '@angular/core';
import {IAmountType, IIncome, IIncomeExpenceSavingType, IBalance, IFrequencyType} from '../../../interfaces';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
    selector: 'app-income-list',
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
    templateUrl: './income-list.component.html',
    styleUrl: './income-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeListComponent { 
    @Input() incomeList:IIncome[]=[];
    expandSet = new Set<number>();

    @Output() viewIncomeDetails=new EventEmitter<IIncome>();
    @Output() deleteIncome=new EventEmitter<IIncome>();
    @Output() editIncome=new EventEmitter<IIncome>();
    public datePipe = inject(DatePipe);

    /**
     * Get the amount type of the income.
     * @param income The income object.
     * @returns The amount type of the income.
     */
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

    /**
     * Get the income type of the income.
     * @param income The income object.
     * @returns The income type of the income.
     */
    getIncomeType(income:IIncome):string{
        if (!income) {
            return '';
          }
      
          switch (income.type) {
            case IIncomeExpenceSavingType.recurrence:
              return 'Recurrente';

            case IIncomeExpenceSavingType.unique:
              return 'Único';

            default:
              return '';
          }
    }

    /**
     * Get the frecuency of an income.
     * @param income IIncome object.
     * @returns string value of income frecuency.
     */
    getIncomeFrequency(income: IIncome): string {
        if (!income) {
            return '-';
        }
        switch (income.frequency) {
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
     * Get the tax name of an income.
     * @param income IIncome object.
     * @returns string value of income tax name.
     */
    getIncomeTax(income: IIncome): string {
        return income.tax?.name ?? "-";
    }

    /**
     * Format the date of the income.
     * @param income The income object.
     */
    formatDate(date: Date | string | null | undefined): string {
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
          style = 'color: ' + IBalance.surplus; ';'
        }
        return style;
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