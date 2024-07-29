import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ITypeForm } from "../../interfaces";

@Component({
    selector: 'app-form-modal',
    standalone: true,
    imports: [],
    template: '',
})
export class FormModalComponent<T> {
    protected fb = inject(FormBuilder);
    protected formGroup!: FormGroup;
    protected ITypeForm = ITypeForm;

    /**
     * Indicates whether the form is loading or not.
     * @default false
     */
    @Input() isLoading?: boolean;

    /**
     *  Indicates whether the modal is visible or not.
     * @default false
     */
    @Input() isVisible?: boolean;

    /**
     * The title of the modal.
     */
    @Input() title!: string;

    /**
     * The form item.
     */
    @Input() item?: T = { id: 0 } as T;

    /**
     * The type of the form.
     */
    @Input() type!: ITypeForm;

    /**
     * The event emitter that emits when the modal is canceled.
     */
    @Output() onCanceled = new EventEmitter<void>();

    /**
     * The event emitter that emits when the form is submitted.
     */
    @Output() onCreated = new EventEmitter<T>();

    /**
     * Event emitter for when the component is updated.
     */
    @Output() onUpdated = new EventEmitter<T>();


    ngOnChanges(changes: SimpleChanges): void {
        // Reset the form when the modal is closed
        if (changes['isVisible']?.currentValue === false) {
            this.formGroup.reset();
            this.isLoading = false;
        }

        // Patch the form values when the modal is opened and the item is set
        if (changes['isVisible']?.currentValue === true) {
            if (this.item) {
                this.formGroup.patchValue(this.item);
            }
        }

        if (changes['isLoading']?.currentValue === false) {
            console.log('isLoading', this.isLoading);
        }
    }

    /**
     * Handles the form submission.
     */
    handleSubmit(): void {
        this.isLoading = true;

        // If the form is valid
        if (this.formGroup.valid) {
            // Mapping the form values to the item
            let item = this.formGroup.getRawValue() as T & { id: number };
            item.id = (this.item as { id?: number })?.id || 0;

            if (this.type === ITypeForm.create) {
                this.onCreated.emit(item);
            }
            else {
                this.onUpdated.emit(item);
            }
        }
        else {
            Object.values(this.formGroup.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            this.isLoading = false;
        }
    }

    /**
     * Resets the form group and emits the `onCanceled` event.
     */
    handleCancel(): void {
        this.onCanceled.emit();
    }

    /**
     * Sets an error for a specific form control.
     * @param nameField - The name of the form control.
     * @param nameError - The error message.
     */
    setControlError(nameField: string, message: string): void {
        this.isLoading = false;
        const control = this.formGroup.get(nameField);
        if (control) {
            control.setErrors({ message });
        }
    }

    stopLoading(): void {
        this.isLoading = false;
    }
}