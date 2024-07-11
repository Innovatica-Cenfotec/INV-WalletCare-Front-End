import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    /**
    * Breadcrumb observable
    */
    private breadcrumbSubject = new BehaviorSubject<string[]>([]);

    /**
     * Set the breadcrumb for the current page
     * @param breadcrumb Breadcrumb to set
     */
    public setBreadcrumb(breadcrumb: string[]): void {
        this.breadcrumbSubject.next(breadcrumb);
    }

    /**
     * Get the breadcrumb observable
     * @returns Breadcrumb observable
     */
    public getBreadcrumbObservable(): BehaviorSubject<string[]> {
        return this.breadcrumbSubject;
    }
}