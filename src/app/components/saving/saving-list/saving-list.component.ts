import { CommonModule,DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ChangeDetectionStrategy, Inject, inject,Component, EventEmitter, Input, Output } from '@angular/core';
import { IIncomeExpenceSavingType, ISaving } from '../../../interfaces';
import { SortByOptions } from '../../../sortBy';


@Component({
  selector: 'app-saving-list',
  standalone: true,
  imports: [CommonModule,
    NzTableModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
    NzCardModule,
    NzStatisticModule,
    NzGridModule,
    NzSpaceModule,
    NzToolTipModule],
  providers: [DatePipe, SortByOptions],
  templateUrl: './saving-list.component.html',
  styleUrl: './saving-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class SavingListComponent {
  public sortby = inject(SortByOptions);
  @Input() savingList:ISaving[]=[];
  @Output() viewSavingDetails=new EventEmitter<ISaving>();
  @Output() deleteSaving=new EventEmitter<ISaving>();
  @Output() editSaving=new EventEmitter<ISaving>();  
  public datePipe=inject(DatePipe);
  formatDate(date: Date | string | null | undefined): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
}
getSavingType(saving:ISaving):string{
  if (!saving) {
      return '';
    }

    switch (saving.type) {
      case IIncomeExpenceSavingType.recurrence:
        return 'Recurrente';
      case IIncomeExpenceSavingType.unique:
        return 'Único';
      default:
        return '';
    }
}

}
