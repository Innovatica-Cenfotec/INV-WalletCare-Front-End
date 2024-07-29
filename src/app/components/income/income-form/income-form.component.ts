import { Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IAmountType, IFrequencyType, IIncome, IIncomeExpenceType, Itax, ITypeForm } from '../../../interfaces';

// Importing Ng-Zorro modules
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


@Component({
    selector: 'app-income-form',
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
    templateUrl: './income-form.component.html',
    styleUrl: './income-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeFormComponent extends FormModalComponent<IIncome> {

    IAmountType = IAmountType;
    IIncomeExpenceType = IIncomeExpenceType;
    IFrequencyType = IFrequencyType;
    TaxSelected: Itax | undefined;
    scheduledDayVisible = false;
    scheduledDay: number = 0;
    days = Array.from({ length: 31 }, (_, i) => i + 1);


    @Input() taxList: any[] = [];
    @Input() incomeType: IIncomeExpenceType = IIncomeExpenceType.unique;
    @Input() enableTemplate: boolean = false;
    
    /**
     * Get the form group
     */
    override formGroup = this.fb.group({
        name: [this.item?.name, [Validators.required, Validators.pattern('[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ 0-9]+'), Validators.minLength(4), Validators.maxLength(100)]],
        description: [this.item?.description, [Validators.maxLength(200)]],
        amount: [this.item?.amount, [Validators.required]],
        amountType: [this.item?.amountType, [Validators.required]],
        scheduledDay: [this.item?.scheduledDay],
        tax: [this.item?.tax],
        isTemplate: [this.item?.isTemplate],
        isTaxRelated: [this.item?.isTaxRelated],
        type: [this.item?.type],
        frequency: [this.item?.frequency],
    });

    formatterConlon = (value: number): string => `₡ ${value}`;
    parserConlon = (value: string): string => value.replace('₡ ', '');

    /**
     * Handles the form submission.
     */
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

        if (this.incomeType === IIncomeExpenceType.recurrence) {
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

        if(this.enableTemplate === false) {
            this.formGroup.get('isTemplate')?.setValue(true);
        }

        this.formGroup.get('isTaxRelated')?.setValue(this.TaxSelected !== null);
        this.formGroup.get('type')?.setValue(this.incomeType);
        super.handleSubmit();
    }

    /**
     * Select the tax
     * @param tax tax to select
     */
    onSelectTax(tax: Itax): void {
        this.TaxSelected = tax;
    }

    /**
     * Select the frequency
     * @param frequency frequency to select
     */
    onSelectFrequency(frequency: IFrequencyType): void {
        this.scheduledDayVisible = frequency === IFrequencyType.other ? true : false;
    }


    /**
     * Select the scheduled day
     * @param scheduledDay scheduled day to select
     */
    onSelectScheduledDay(scheduledDay: any): void {
        this.scheduledDay = scheduledDay;
    }
}