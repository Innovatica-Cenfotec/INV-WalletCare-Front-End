import { CommonModule, DatePipe } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ChangeDetectionStrategy, Inject, inject, Component, EventEmitter, Input, Output } from '@angular/core';
import { IIncomeExpenceSavingType, ISaving } from '../../../interfaces';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { differenceInDays } from 'date-fns';
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
    NzToolTipModule,
    NzProgressModule],
  providers: [DatePipe, SortByOptions],
  templateUrl: './saving-list.component.html',
  styleUrl: './saving-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SavingListComponent {
  IIncomeExpenseSavingType = IIncomeExpenceSavingType;
  public sortby = inject(SortByOptions);
  @Input() savingList:ISaving[]=[];
  @Output() viewSavingDetails=new EventEmitter<ISaving>();
  @Output() deleteSaving=new EventEmitter<ISaving>();
  @Output() editSaving=new EventEmitter<ISaving>();  
  public datePipe=inject(DatePipe);
  expandSet = new Set<number>();
  
  formatDate(date: Date | string | null | undefined): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }
  
  getSavingType(saving: ISaving): string {
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
  
  onExpandChange(id: number | undefined, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id ?? 0);
    } else {
      this.expandSet.delete(id ?? 0);
    }
  }
  
  calculateProgress(saving: ISaving): number {
    if (!saving.targetDate || !saving.createdAt) {
      return 0;
    }
    const targetDate = new Date(saving.targetDate);
    const createdAt = new Date(saving.createdAt);
    const totalDays = differenceInDays(targetDate, createdAt);
    const daysPassed = differenceInDays(new Date(), createdAt);
    if (totalDays <= 0) {
      return 100; // Progreso completo si ya se alcanzó la fecha objetivo
    }

    const progress = (daysPassed / totalDays) * 100;
    const percentage = Math.min(progress, 100)

    return Math.round(percentage);
  }
  
  calculateDaysPassed(saving: ISaving): number {
    if (!saving.createdAt) {
      return 0;
    }
    const createdAt = new Date(saving.createdAt);
    const daysPassed = differenceInDays(new Date(),createdAt );
    return daysPassed;
  }
  
  calculateDaysLeft(saving: ISaving): number {
    if (!saving.targetDate || !saving.createdAt) {
      return 0;
    }
    const targetDate = new Date(saving.targetDate);
    const createdAt = new Date(saving.createdAt);
    const daysPassed = differenceInDays(new Date(), createdAt);
    const totalDays = differenceInDays(targetDate, createdAt);
    return totalDays-daysPassed;
  }

  getProgressForSaving(saving: ISaving): number {
    return this.calculateProgress(saving);
  }

}
