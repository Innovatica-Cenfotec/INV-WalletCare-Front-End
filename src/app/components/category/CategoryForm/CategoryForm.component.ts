import { ReactiveFormsModule, Validators,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormModalComponent } from '../../form-modal/form-modal.component';

// Importing Ng-Zorro modules
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

// Importing custom components and interfaces
import { IAccountType, ICategory } from '../../../interfaces';

@Component({
    selector: 'app-category-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NzModalModule,
        NzButtonComponent,
        NzFormModule,
        NzInputModule
    ],
    templateUrl: './CategoryForm.component.html',
    styleUrl: './CategoryForm.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryFormComponent extends FormModalComponent<ICategory> {
    /**
     * The type of the form.
     */
    IAccountType = IAccountType;

    /**
     * Get the form group
     */
    override formGroup = this.fb.group({
        name: [this.item?.name, [Validators.required, Validators.pattern('[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ 0-9]+'), Validators.minLength(4), Validators.maxLength(100)]]
    });

    /**
     * Handles the form submission.
     */
    override handleSubmit() {
        // trim category name and mark as touched if invalid
        this.formGroup.get('name')?.setValue(this.formGroup.get('name')?.value?.trim());
        if (this.formGroup.get('name')?.invalid) {
            this.formGroup.get('name')?.markAsTouched();
            return;
        }

        super.handleSubmit();
    }
}