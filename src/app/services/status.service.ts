import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class StatusService {
    private source: string = 'status';
    protected http = inject(HttpClient);

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