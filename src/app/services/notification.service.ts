import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IGenericResponse, INotification, INotificationOTP } from '../interfaces';
import { catchError, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService extends BaseService<INotification> {
    protected override source: string = 'notifications';
    private responseSignal = signal<IGenericResponse>({});
    private notificationListSignal = signal<INotification[]>([]);
    private notificationSignal = signal<INotification | undefined>(undefined);

    /*
    * Get the notifications.
    */
    get notifications$() {
        return this.notificationListSignal.asReadonly();
    }

    /*
    * Get the notification.
    */
    get notification$() {
        return this.notificationSignal.asReadonly();
    }
    
    /**
     * Send a user a notification signal. Only ADMIN have access.
     * @param notification - The notification signal to be send.
     * @returns An Observable that emits the send notification signal.
     */
    sendNotificationSignal(notification: INotificationOTP): Observable<INotification> {
        return this.http.post(`${this.source}/send`, notification).pipe(
            tap((response: any) => {
                this.notificationListSignal.update(notification => [response, ...notification]);
            }),
            catchError(error => {
                console.error('Error sending the notification', error);
                throw error;
            })
        );
    }

    /**
     * Retreives all the notifications owned by the user
     */
    findAllSignal() {
        return this.findAll().subscribe({
            next: (response: any) => {
                this.notificationListSignal.set(response);
            }, error: (error: any) => {
                console.error('Error fetching expenses', error);
                throw error;
            }
        });
    }
      
    /**
     * Mark a notification as read signal.
     * @param id - The notification to be updated.
     * @returns An Observable that emits the updated notification.
     */
    markAsReadNotifSignal(id: number | undefined): Observable<any> {
        return this.http.put(`${this.source}/read/${id}`, null).pipe(
            tap((response: any) => {
                this.notificationListSignal.update(
                    notifications => notifications.map(a => a.id === response.id ? response : a)
                );
                this.notificationSignal.set(response);
            }),
            catchError(error => {
                console.error('Error marking notification as read. ', error);
                throw error;
            })
        );
    }

    /**
     * Deletes an notification signal.
     * @param id - The notification to be deleted.
     * @returns An Observable that emits the deleted notification.
     */
    deleteNotificationSignal(id: number | undefined): Observable<any> {
        if (!id) {
            throw new Error('Invalid notification ID. ');
        }

        return this.del(id).pipe(
            tap((response: any) => {
                this.notificationListSignal.update(
                    notification => notification.filter(a => a.id !== id)
                );
            }),
            catchError(error => {
                console.error('Error deleting notification. ', error);
                throw error;
            })
        );
    }
}
