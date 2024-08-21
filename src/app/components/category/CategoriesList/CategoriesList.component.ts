import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ICategory } from '../../../interfaces';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
    selector: 'app-categories-list',
    standalone: true,
    imports: [
        CommonModule,
        NzTableModule,
        NzDividerModule,
        NzIconModule,
        NzButtonModule,
        NzSpaceModule,
    ],
    providers: [DatePipe],
    templateUrl: './CategoriesList.component.html',
    styleUrl: './CategoriesList.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesListComponent {
    public datePipe = inject(DatePipe);
    
    /**
     * Input property to accept an array of categories to be displayed.
     */
    @Input() categoriesList: ICategory[] = [];

    /**
     * Output event emitter to notify when a category needs to be deleted.
     * Emits the category object that was selected.
     */
    @Output() deleteCategory = new EventEmitter<ICategory>();

    /**
     * Output event emitter to notify when a category needs to be edited.
     * Emits the category object that was selected.
     */
    @Output() editCategory = new EventEmitter<ICategory>();

    /**
     * Format the date to a string.
     * @param date The date to be formatted.
     */
    formatDate(date: Date | undefined): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
 }
