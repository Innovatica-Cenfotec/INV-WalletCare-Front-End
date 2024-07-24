import { CommonModule } from '@angular/common';
import { Component, inject, Input, TemplateRef, ViewChild, OnInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';

// Importing Ng-Zorro modules
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzModalService } from 'ng-zorro-antd/modal';

// Importing custom components and interfaces
import { IAccount, IAccountType, ITypeForm } from '../../../interfaces';
import { FormModalComponent } from '../../form-modal/form-modal.component';
import { id_ID } from 'ng-zorro-antd/i18n';

@Component({
    selector: 'app-account-from',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        NzModalModule,
        NzButtonComponent,
        NzFormModule,
        NzInputModule,
        NzRadioModule
    ],
    templateUrl: './account-from.component.html',
    styleUrl: './account-from.component.scss'
})
export class AccountFromComponent extends FormModalComponent<IAccount> {
    private modalService = inject(NzModalService);
    @Input() nameDefaultAccount: string = '';
    @ViewChild('termsContent') termsContent !: TemplateRef<any>;

    /**
     * The type of the form.
     */
    IAccountType = IAccountType;

    /**
     * Get the form group
     */
    override formGroup = this.fb.group({
        name: [this.item?.name, [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(100)]],
        description: [this.item?.description, [Validators.maxLength(200)]],
        type: [this.item?.type, [Validators.required, Validators.min(0), Validators.max(1)]]
    });

    /**
     * Handles the form submission.
     */
    override handleSubmit() {
        // trim all inputs and mark as touched if invalid
        for (const key in this.formGroup.controls) {
            this.formGroup.get(key)?.setValue(this.formGroup.get(key)?.value?.trim());
            if (this.formGroup.get(key)?.invalid) {
                this.formGroup.get(key)?.markAsDirty();
                this.formGroup.get(key)?.updateValueAndValidity({ onlySelf: true });
            }
        }

        if (this.formGroup.invalid) {
            return;
        }

        // if type account shared, show terms and conditions
        if (this.type == ITypeForm.create && this.formGroup.get('type')?.value == IAccountType.shared) {
            this.modalService.confirm({
                nzTitle: "Al crear una cuenta compartida, estás accediendo a:",
                nzContent: this.termsContent,
                nzOkText: "Aceptar",
                nzCancelText: "Cancelar",
                nzWidth: 500,
                nzOnOk: () => {
                    super.handleSubmit();
                }
            });
            return;
        }

        super.handleSubmit();
    }
}