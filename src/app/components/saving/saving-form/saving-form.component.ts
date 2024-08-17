import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { FormModalComponent } from '../../form-modal/form-modal.component';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { ISaving } from '../../../interfaces';
import { IIncomeExpenceSavingType, IFrequencyType } from '../../../interfaces/index';

@Component({
  selector: 'app-saving-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    NzButtonComponent,
    NzFormModule,
    NzInputModule,
    NzRadioModule,
    NzInputNumberModule,
    NzCheckboxModule,
    NzFlexModule,
    NzSelectModule,
    NzDescriptionsModule,
    NzCalendarModule,
    NzTypographyModule
  ],
  templateUrl: './saving-form.component.html',
  styleUrl: './saving-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingFormComponent extends FormModalComponent<ISaving> {

  IIncomeExpenseSavingType = IIncomeExpenceSavingType;
  IFrequencyType = IFrequencyType;
  scheduledDayVisible = false;
  scheduledDay: number = 0;
  days = Array.from({length: 31}, (_, i) => i + 1);

  @Input() savingType: IIncomeExpenceSavingType = IIncomeExpenceSavingType.unique;
  @Input() id: number = 0;
  @Input() enableTemplate: boolean = false;

  override formGroup = this.fb.group({
    name: [this.item?.name, [Validators.required, Validators.pattern('[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ 0-9]+'), Validators.minLength(4), Validators.maxLength(100)]],
    description: [this.item?.description, [Validators.maxLength(200)]],
    amount: [this.item?.amount, [Validators.required, Validators.min(1)]],
    scheduledDay: [this.item?.scheduledDay],
    type: [this.item?.type],
    frequency: [this.item?.frequency],
  });

  formatterConlon = (value: number): string => `₡ ${value}`;
  parserConlon = (value: string): string => value.replace('₡ ', '');

  override handleSubmit() {
    for (const key in this.formGroup.controls) {
      if (typeof this.formGroup.get(key)?.value === 'string') {
        // Trim the string
        this.formGroup.get(key)?.setValue(this.formGroup.get(key)?.value?.trim());
      }

      // If the form control is invalid, mark it as dirty
      if (this.formGroup.get(key)?.invalid) {
        this.formGroup.get(key)?.markAsDirty();
        this.formGroup.get(key)?.updateValueAndValidity({ onlySelf: true });
      }
    }

    if (this.savingType === IIncomeExpenceSavingType.recurrence) {
      const frequency = this.formGroup.get('frequency')?.value;
      // If the frequency is null, mark it as dirty
      if (frequency === null) {
        this.formGroup.get('frequency')?.markAsDirty();
        this.formGroup.get('frequency')?.updateValueAndValidity({ onlySelf: true });
        this.formGroup.get('frequency')?.setErrors({ required: true });
        return;
      }

      if (frequency === IFrequencyType.other) {
        const scheduledDay = this.formGroup.get('scheduledDay')?.value as number;

        // 1 <= otherFrequency <= 31
        if (scheduledDay < 1 || scheduledDay > 31) {
          this.formGroup.get('scheduledDay')?.markAsDirty();
          this.formGroup.get('scheduledDay')?.updateValueAndValidity({ onlySelf: true });
          this.formGroup.get('scheduledDay')?.setErrors({ required: true });
          return;
        }
      }
    }

    // If any of the form controls is invalid, return
    if (this.formGroup.invalid) {
      return;
    }

    this.formGroup.get('type')?.setValue(this.savingType);
    super.handleSubmit();
  }

  onSelectFrequency(frequency: IFrequencyType): void {
    this.scheduledDayVisible = frequency === IFrequencyType.other ? true : false;
  }

  onSelectScheduledDay(scheduledDay: any): void {
    this.scheduledDay = scheduledDay;
  }
}
