import { Injectable } from '@angular/core';
import { ILoginResponse, IResponse, IUser } from '../interfaces';
import { Observable, firstValueFrom, of, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken!: string;
  private expiresIn!: number;
  private user: IUser = { email: '', authorities: [] };

  constructor(private http: HttpClient) {
    this.load();
  }

  /**
   * Saves the user, access token, and expiration time to local storage.
   */
  public save(): void {
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));

    if (this.accessToken)
      localStorage.setItem('access_token', JSON.stringify(this.accessToken));

    if (this.expiresIn)
      localStorage.setItem('expiresIn', JSON.stringify(this.expiresIn));
  }

  /**
   * Loads the user, access token, and expiration time from local storage.
   */
  private load(): void {
    let token = localStorage.getItem('access_token');
    if (token) this.accessToken = token;
    let exp = localStorage.getItem('expiresIn');
    if (exp) this.expiresIn = JSON.parse(exp);
    const user = localStorage.getItem('auth_user');
    if (user) this.user = JSON.parse(user);
  }

  /**
   * Retrieves the current user.
   * 
   * @returns {IUser | undefined} The current user.
   */
  public getUser(): IUser | undefined {
    return this.user;
  }

  /**
   * Retrieves the access token.
   * 
   * @returns {string | null} The access token.
   */
  public getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Checks if the user is authenticated.
   * 
   * @returns {boolean} True if the user is authenticated, otherwise false.
   */
  public check(): boolean {
    if (!this.accessToken) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Logs in the user with the given credentials.
   * 
   * @param {Object} credentials The user's login credentials.
   * @param {string} credentials.email The user's email.
   * @param {string} credentials.password The user's password.
   * @returns {Observable<ILoginResponse>} An observable containing the login response.
   */
  public login(credentials: {
    email: string;
    password: string;
  }): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>('auth/login', credentials).pipe(
      tap((response: any) => {
        this.accessToken = response.token;
        this.user.email = credentials.email;
        this.expiresIn = response.expiresIn;
        this.user = response.authUser;
        this.save();
      })
    );
  }

  /**
   * Checks if the user has a specific role.
   * 
   * @param {string} role The role to check for.
   * @returns {boolean} True if the user has the role, otherwise false.
   */
  public hasRole(role: string): boolean {
    return this.user.authorities ? this.user?.authorities.some(authority => authority.authority == role) : false;
  }

  /**
   * Checks if the user has any of the specified roles.
   * 
   * @param {any[]} roles The roles to check for.
   * @returns {boolean} True if the user has any of the roles, otherwise false.
   */
  public hasAnyRole(roles: any[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Retrieves the routes permitted for the user based on their roles.
   * 
   * @param {any[]} routes The routes to check.
   * @returns {any[]} The permitted routes for the user.
   */
  public getPermittedRoutes(routes: any[]): any[] {
    let permittedRoutes: any[] = [];
    for (const route of routes) {
      if (route.data && route.data.authorities) {
        if (this.hasAnyRole(route.data.authorities)) {
          permittedRoutes.unshift(route);
        }
      }
    }
    return permittedRoutes;
  }

/**
 * Method to register a new user.
 * 
 * @param {IUser} user - Object containing the user information to be registered.
 * @param {any} accountName - Name of the account to be associated with the user.
 * @param {any} accountDescription - Description of the account to be associated with the user.
 * @returns {Observable<ILoginResponse>} - Observable that emits the server response after the signup attempt.
 * 
 * This method makes an HTTP POST request to the 'auth/signup' endpoint with the user data and additional parameters.
 * The parameters are added to the URL as query parameters.
 */
  public signup(user: IUser, accountName: any, accountDescription: any): Observable<ILoginResponse> {
    let params = new HttpParams().set('accountName', accountName).set('accountDescription', accountDescription);
    return this.http.post<ILoginResponse>('auth/signup', user, { params: params });
  }

  /**
   * Logs out the current user.
   */
  public logout() {
    this.user = { email: '', authorities: [] };
    this.accessToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('auth_user');
  }

  /**
   * Updates the nickname of the current user.
   * 
   * @param {string | undefined} nickname The new nickname.
   */
  public updateNickname(nickname: string | undefined) {
    this.user.nickname = nickname;
    if (this.user) localStorage.setItem('auth_user', JSON.stringify(this.user));
  }

}
