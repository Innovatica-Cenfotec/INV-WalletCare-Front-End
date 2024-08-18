import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse, IUser } from '../interfaces';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
    protected source!: string;
    protected http = inject(HttpClient);

    /**
     * Retrieves a single item by its ID.
     * @param id - The ID of the item to retrieve.
     * @returns An Observable that emits an IResponse containing the retrieved item.
     */
    public find(id: number | undefined): Observable<IResponse<T>> {
        return this.http.get<IResponse<T>>(this.source + '/' + id);
    }

    /**
     * Retrieves all items.
     * @param s - Optional search parameter.
     * @returns An Observable that emits an IResponse containing an array of items.
     */
    public findAll(s: string = ''): Observable<IResponse<T[]>> {
        return this.http.get<IResponse<T[]>>(this.source, { params: { s } });
    }

    /**
     * Adds a new item.
     * @param data - The data of the item to add.
     * @returns An Observable that emits an IResponse containing the added item.
     */
    public add(data: {}): Observable<IResponse<T>> {
       return this.http.post<IResponse<T>>(this.source, data);
    }

    /**
     * Edits an existing item.
     * @param id - The ID of the item to edit.
     * @param data - The updated data of the item.
     * @returns An Observable that emits an IResponse containing the edited item.
     */
    public edit(id: number | undefined, data: {}): Observable<IResponse<T>> {
        return this.http.put<IResponse<T>>(this.source + '/' + id, data);
    }

    /**
     * Deletes an item by its ID.
     * @param id - The ID of the item to delete.
     * @returns An Observable that emits an IResponse containing the deleted item.
     */
    public del(id: any): Observable<IResponse<T>> {
        return this.http.delete<IResponse<T>>(this.source + '/' + id);
    }

    /**
     * Retrieves a list with the items filtered by params.
     * @param params - An array of params to use.
     * @returns An Observable that emits an IResponse containing an array of items.
     */
    public filter(params: { [key: string]: string | number | boolean }): Observable<IResponse<T[]>> {
        let httpParams = new HttpParams();
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                httpParams = httpParams.set(key, params[key].toString());
            }
        }
        return this.http.get<IResponse<T[]>>(this.source + '/filter', { params: httpParams });
    }
}
