import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

// Importing Ng-Zorro modules
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { SavingService } from '../../services/saving.service';
import { IIncomeExpenceSavingType, ISaving, ITypeForm } from '../../interfaces';
import { IncomeFormComponent } from '../../components/income/income-form/income-form.component';
import { IncomeAllocationsComponent } from "../../components/income/income-allocations/income-allocations.component";
import { SavingListComponent } from '../../components/saving/saving-list/saving-list.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SavingFormComponent } from '../../components/saving/saving-form/saving-form.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [
    CommonModule,
    NzPageHeaderModule,
    NzButtonComponent,
    NzSpaceModule,
    NzIconModule,
    NzModalModule,
    SavingListComponent,
    IncomeFormComponent,
    IncomeAllocationsComponent,
    NzButtonModule,
    NzDropDownModule, 
    SavingFormComponent,
    NzPopoverModule
  ],
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.scss'
})
export class SavingsComponent {
  public savingService = inject(SavingService);
  public router = inject(Router);
  public ISavingType = IIncomeExpenceSavingType;
  public title: string = '';
  public nzModalService = inject(NzModalService)
  private nzNotificationService = inject(NzNotificationService);

  @ViewChild(SavingFormComponent) form!: SavingFormComponent;

  public isVisible = signal(false);

  public isLoading = signal(false);

  public saving = signal<ISaving | undefined>(undefined);

  public TypeForm: ITypeForm = ITypeForm.create;

  ngOnInit(): void {
    this.savingService.findAllSignal();

  }

  onCanceled(): void {
    this.isVisible.set(false);
    this.isLoading.set(false);
  }

  viewSavingDetails(saving: ISaving): void {
    this.router.navigateByUrl('app/savings/details/' + saving.id);
  }

  deleteSaving(saving: ISaving): void {
    this.nzModalService.confirm({
      nzTitle: '¿Estás seguro de que quieres eliminar este ahorro ingreso?',
      nzContent: 'Si eliminas el ahorro, se eliminarán todos los datos relacionados con el.',
      nzOkText: 'Sí',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.savingService.deleteSavingSignal(saving.id).subscribe({
          next: () => {
            this.nzNotificationService.success('Éxito', 'El Ahorro se ha eliminado correctamente');

          },
          error: (error: any) => {
            this.nzNotificationService.error('Lo sentimos', error.error.detail);
          }
        });
      },
      nzCancelText: 'No'
    });

  }

  showModalEdit(saving: ISaving): void {
    this.title = 'Editar ahorro';
    this.TypeForm = ITypeForm.update;
    this.form.item = saving;
    this.isVisible.set(true);
  }

  updateSaving(saving: ISaving): void {
    this.savingService.updateSavingSignal(saving).subscribe({
      next: (response: any) => {
        this.isVisible.set(false);
        this.nzNotificationService.create("success", "", 'Ahorro actualizado exitosamente', { nzDuration: 5000 });
      },
      error: (error: any) => {
        // Displaying the error message in the form
        error.error.fieldErrors?.map((fieldError: any) => {
          this.form.setControlError(fieldError.field, fieldError.message);
        });

        // show other errors
        if (error.error.fieldErrors === undefined) {
          this.nzNotificationService.error('Lo sentimos', error.error.detail);
        }

        this.form.stopLoading();
      }
    })
  }

}
