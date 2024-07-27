import { FormControl, NonNullableFormBuilder, FormRecord,FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';

// Importing Ng-Zorro modules
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';

import { IAccount, IIncomeAllocation , IAllocation } from '../../../interfaces';

@Component({
  selector: 'app-income-allocations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzButtonComponent,
    NzInputModule,
    NzInputNumberModule,
    NzIconModule,
    NzFlexModule,
    NzSpaceModule,
    NzAutocompleteModule    
  ],
  templateUrl: './income-allocations.component.html',
  styleUrl: './income-allocations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeAllocationsComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  
  @Input() amount: number = 0;
  @Input() listAccount: any[] = [];
  listAllocation: IIncomeAllocation[] = []
  selectedAccount: IAccount = {};

  formatterPercent = (value: number): string => `${value} %`;
  parserPercent = (value: string): string => value.replace(' %', '');
  formatterConlon = (value: number): string => `₡ ${value}`;
  parserConlon = (value: string): string => value.replace('₡ ', '');

  public validateForm: FormRecord<FormControl<IAllocation>> = this.fb.record({});
  public listOfControl: Array<IAllocation> = [];

  addField(e?: MouseEvent): void {
    e?.preventDefault();  
    const id = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const control: IAllocation = {
      id,
      controlInstance: `account-${id}`,
      name: 'Test', 
      amount: this.fb.control(0),
      percentage: this.fb.control(0)
    };
  
    this.listOfControl.push(control); 
  }

  removeField(i: IAllocation, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  ngOnInit(): void {
    this.addField();
  }
}