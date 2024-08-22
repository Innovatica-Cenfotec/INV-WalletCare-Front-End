import { CategoryService } from './../../services/category.service';
import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importing Ng-Zorro modules
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

// Importing custom components and interfaces
import { AccountFormComponent } from '../../components/account/account-form/account-form.component';
import { AccountListComponent } from '../../components/account/account-list/account-list.component'
import { AccountCardsComponent } from '../../components/account/account-cards/account-cards.component';
import { ICategory, ITypeForm } from '../../interfaces';
import { CategoryFormComponent } from '../../components/category/CategoryForm/CategoryForm.component';
import { CategoriesListComponent } from '../../components/category/CategoriesList/CategoriesList.component';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
    selector: 'app-categories',
    standalone: true,
    imports: [
        CommonModule,
        AccountFormComponent,
        AccountListComponent,
        AccountCardsComponent,
        NzPageHeaderModule,
        NzButtonComponent,
        NzSpaceModule,
        NzDescriptionsModule,
        NzStatisticModule,
        NzGridModule,
        NzCardModule,
        NzIconModule,
        NzDividerModule,
        NzModalModule,
        CategoryFormComponent,
        CategoriesListComponent,
        NzPopoverModule
    ],
    templateUrl: './Categories.component.html',
    styleUrl: './Categories.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
    public CategoryService = inject(CategoryService);
    private nzNotificationService = inject(NzNotificationService);
    private nzModalService = inject(NzModalService);

    /**
     * The title of the category creation form.
     */
    public title = "Crear Categoría";

    /**
     * The visibility of the category creation form.
     */
    public isVisible = signal(false);

    /**
     * The loading state of the categories.
     */
    public isLoading = signal(false);

    /**
     * Type of form to show
     */
    public TypeForm: ITypeForm = ITypeForm.create;

    /**
     * The category to be edited.
     */
    public category = signal<ICategory | undefined>(undefined);

    /**
     * Reference to the category form component.
     */
    @ViewChild(CategoryFormComponent) form!: CategoryFormComponent;

    ngOnInit(): void {
        this.CategoryService.getAllSignal();
    }

    /**
     * Closes the category creation form.
     */
    onCanceled(): void {
        this.isVisible.set(false);
        this.isLoading.set(false);
    }

    /**
     * Shows the modal to edit the category.
     */
    showModalEdit(category: ICategory): void {
        this.title = "Editar Categoría";
        this.TypeForm = ITypeForm.update;
        this.form.item = category;
        this.isVisible.set(true);
    }

    /**
    * Shows the modal to create the category.
    */
    showModalCreate(): void {
        this.title = "Crear Categoría";
        this.TypeForm = ITypeForm.create;
        this.category.set(undefined);
        this.isVisible.set(true);
    }

    /**
    * Create a category
    * @param category category to create
    */
    createCategory(category: ICategory): void {
        this.CategoryService.saveCategorySignal(category).subscribe({
            next: (response: any) => {
                this.isVisible.set(false);
                this.nzNotificationService.create("success", "", 'Categoría creada correctamente', { nzDuration: 5000 });
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
        });
    }

    /**
    * Update a category
    * @param category category to update
    */
    updateCategory(category: ICategory): void {
        this.CategoryService.updateCategorySignal(category).subscribe({
            next: (response: any) => {
                this.isVisible.set(false);
                this.nzNotificationService.create("success", "", 'Categoría actualizada correctamente', { nzDuration: 5000 });
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
        });
    }

    /**
     * Deletes the category
     * @param category category to delete
     */
    deleteCategory(category: ICategory): void {
        this.nzModalService.confirm({
            nzTitle: '¿Estás seguro de eliminar esta categoría?',
            nzContent: 'Esta acción no se puede deshacer',
            nzOkText: 'Sí',
            nzOkType: 'primary',
            nzCancelText: 'No',
            nzOnOk: () => {
                this.CategoryService.deleteCategorySignal(category).subscribe({
                    next: (response: any) => {
                        this.nzNotificationService.create("success", "", 'Categoría eliminada correctamente', { nzDuration: 5000 });
                    },
                    error: (error: any) => {
                        this.nzNotificationService.error('Lo sentimos', error.error.detail);
                    }
                });
            }
        });
    }
}