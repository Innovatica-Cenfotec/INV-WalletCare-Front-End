import { Validators, FormBuilder, ReactiveFormsModule, FormControl ,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { IAmountType, IFrequencyType, IIncomeExpenseType } from '../../interfaces';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NzAutocompleteModule,
        NzModalModule,
        NzFormModule,
        NzButtonModule,
        NzDescriptionsModule,
        NzSelectModule,
        NzIconModule,
        NzInputModule,
        NzTypographyModule
    ],
    templateUrl: './transaction-form.component.html',
    styleUrl: './transaction-form.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionFormComponent implements OnChanges {
    protected fb = inject(FormBuilder);
    IIncomeExpenseType = IIncomeExpenseType;

    /**
     * The list of income.
     */
    @Input() listIncome: any[] = [];

    /**
     * The list of expense.
     */
    @Input() listExpense: any[] = [];

    /**
     * The type of the form. Income or Expense.
     */
    @Input() type: 'income' | 'expense' = 'income';

    /**
     *  Indicates whether the modal is visible or not.
     * @default false
     */
    @Input() isVisible: boolean = false;

    /**
    * Indicates whether the form is loading or not.
    * @default false
    */
    @Input() isLoading: boolean = false;

    /**
     * The event emitter that emits when the form is canceled.
     */
    @Output() onCancel = new EventEmitter<void>();

    /**
     * The event emitter that emits when the form is confirmed.
     */
    @Output() onConfirm = new EventEmitter<any>();

    /**
     * The selected item.
     */
    selectedItem: any;

    formGroup = this.fb.group({
        selected: [null, [Validators.required]]
    });

    ngOnChanges(changes: SimpleChanges): void {
        // Reset the form when the modal is closed
        if (changes['isVisible']?.currentValue === false) {
            this.isLoading = false;
            this.selectedItem = null;
            this.formGroup.reset();
        }
    }

    onSelectItem(item: any): void {
        this.selectedItem = item;
    }

    /**
     * Resets the form group and emits the `onCanceled` event.
     */
    handleCancel(): void {               
        this.onCancel.emit();
    }

    /**
    * Emits the `onConfirm` event with the form group value.
    */
    handleConfirm(): void {
        // validate the form
        if (this.formGroup.invalid) {
            this.formGroup.get('selected')?.markAsDirty();
            this.formGroup.get('selected')?.updateValueAndValidity({ onlySelf: true });
            return;
        }

        this.isLoading = true;
        this.onConfirm.emit(this.selectedItem);        
    }

    /**
     * Gets the amount type of the item.
     * @param item The item.
     * @returns The amount type.
     */
    getAmountType(item: any): string {
        if (!item) {
            return '';
        }

        return item.amountType === IAmountType.net ? 'Sí' : 'No';
    }

    /**
     * Gets the type of the item.
     * @param item The item.
     * @returns The type.
     */
    getType(item: any): string {
        if (!item) {
            return '';
        }

        return item.type === IIncomeExpenseType.unique ? 'Único' : 'Recurrencia';
    }

    /**
     * Gets the frequency of the item.
     * @param item The item.
     * @returns The frequency.
     */
    getFrequency(item: any): string {
        if (!item) {
            return '';
        }

        switch (item.frequency) {
            case IFrequencyType.daily:
                return 'Diario';
            case IFrequencyType.weekly:
                return 'Semanal';
            case IFrequencyType.biweekly:
                return 'Quincenal';
            case IFrequencyType.monthly:
                return 'Mensual';
            case IFrequencyType.annual:
                return 'Anual';
            case IFrequencyType.other:
                return 'Otro';
            default:
                return '';
        }
    }

    /**
     * Gets the error message.
     * @returns The error message.
     */
    getErrorMessage(): string {
        return this.type === 'income' ? 'Por favor seleccione un ingreso' : 'Por favor seleccione un gasto';
    }

    /**
     * Gets the placeholder.
     * @returns The placeholder.
     */
    getPleaceholder(): string {
        return this.type === 'income' ? 'Seleccione un ingreso' : 'Seleccione un gasto';
    }

    /**
     * Gets the title.
     * @returns The title.
     */
    getTitle(): string {
        return this.type === 'income' ? 'Agregar ingreso a la cuenta' : 'Agregar gasto a la cuenta';
    }
}