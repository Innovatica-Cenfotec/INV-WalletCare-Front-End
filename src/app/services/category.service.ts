import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { ICategory } from '../interfaces';

@Injectable({
    providedIn: 'root',
})
export class CategoryService extends BaseService<ICategory> {
    protected override source: string = 'categories';
    private categoriesListSignal = signal<ICategory[]>([]);

    get categories$() {
        return this.categoriesListSignal;
    }

    /**
     * Fetch all categories
     */
    getAllSignal() {
        this.findAll().subscribe({
            next: (response: any) => {
                response.reverse();
                this.categoriesListSignal.set(response);
            },
            error: (error: any) => {
                console.error('Error fetching categories', error);
            }
        });
    }

    /**
     * Save a category
     * @param category category to save
     * @returns Observable<any>
     */
    saveCategorySignal(category: ICategory): Observable<any> {
        return this.add(category).pipe(
            tap((response: any) => {
                this.categoriesListSignal.update(categories => [response, ...categories]);
            }),
            catchError(error => {
                console.error('Error saving category', error);
                return throwError(error);
            })
        );
    }

    /**
     * Update a category
     * @param category category to update
     * @returns Observable<any>
     */
    updateCategorySignal(category: ICategory): Observable<any> {
        return this.edit(category.id, category).pipe(
            tap((response: any) => {
                const updatedCategories = this.categoriesListSignal().map(c => c.id === category.id ? response : c);
                this.categoriesListSignal.set(updatedCategories);
            }),
            catchError(error => {
                console.error('Error updating category', error);
                return throwError(error);
            })
        );
    }

    /**
     * Delete a category 
     * @param category category to delete
     * @returns  Observable<any>
     */
    deleteCategorySignal(category: ICategory): Observable<any> {
        return this.del(category.id).pipe(
            tap((response: any) => {
                const updatedCategories = this.categoriesListSignal().filter(c => c.id !== category.id);
                this.categoriesListSignal.set(updatedCategories);
            }),
            catchError(error => {
                console.error('Error deleting category', error);
                return throwError(error);
            })
        );
    }
}
