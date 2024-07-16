import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, viewChild, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder,FormGroup,FormControl } from '@angular/forms';
import { ReactiveFormsModule ,Validators } from '@angular/forms';

// Importing Ng-Zorro modules
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRadioModule } from 'ng-zorro-antd/radio';

// Importing custom components and interfaces
import { IAccount, IAccountType, ITypeForm } from '../../../interfaces';
import { FormModalComponent } from '../../form-modal/form-modal.component';

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
    IAccountType = IAccountType;
  
    /**
     * Get the form group
     */
    override formGroup = this.fb.group({
        name: [this.item?.name, [Validators.required, Validators.pattern('[a-zA-Z ]*'), Validators.minLength(4), Validators.maxLength(100)]],
        description: [this.item?.description,[Validators.maxLength(200)]],    
        type: [this.item?.type,[Validators.required,Validators.min(0), Validators.max(1)]]
    });
}