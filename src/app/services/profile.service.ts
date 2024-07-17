import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends BaseService<IUser> {
  public authService = inject(AuthService);
  protected override source: string = 'users/me';
  private userObservable: Observable<IUser> | undefined;

  /**
   * Gets the user observable.
   * 
   * @returns {Observable<IUser> | undefined} The user observable.
   */
  getUserObservable(): Observable<IUser> | undefined{
    return this.userObservable;
  }

  /**
   * Retrieves the user profile from the backend.
   * 
   * @returns {Observable<IUser>} An observable containing the user profile data.
   */
  getUserProfile() {
    return this.http.get<IUser>(this.source);
  }

  /**
   * Updates the user profile.
   * 
   * @param {IUser} user The user data to be updated.
   */
  updateUserProfile(user: IUser) {
    this.userObservable = new Observable<IUser>(observer => {
      observer.next(user);
    });
    this.authService.updateNickname(user.nickname);
    this.edit(user.id, user).subscribe({
      next: (response: any) => {
        console.log(response);
      }
    });
  }
}
