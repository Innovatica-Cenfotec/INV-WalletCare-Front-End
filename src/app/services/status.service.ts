import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
/**
 * Service for checking the server status.
 */
export class StatusService {
    private source: string = 'status';
    protected http = inject(HttpClient);

    /**
     * Checks the server status.
     * @returns A promise that resolves to a boolean indicating the server status.
     */
    checkServerStatus(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.http.get(this.source, { responseType: 'text' }).subscribe({
                next: (response: any) => {
                   resolve(true);
                },
                error: (error: any) => {
                    console.error('Error fetching users', error);
                    resolve(false);
                }
            });
        });
    }
}