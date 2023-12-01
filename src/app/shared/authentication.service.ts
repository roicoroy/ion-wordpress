import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Subject, Observable, of, from } from 'rxjs';
import { map, catchError, concatMap } from 'rxjs/operators';
import { IonStorageService } from './utils/ionstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private loggedUser: Subject<any> = new Subject<any>();

  private http = inject(HttpClient);
  
  private ionStorage = inject(IonStorageService);

  constructor() {}

  async getUser() {
    // const { value } = await Storage.get({ key: 'user' });
    const { value } = await this.ionStorage.storageGet('user');
    return value;
  }

  async setUser(user: any) {
    // await Storage.set({
    //   key: 'user',
    //   value: JSON.stringify(user)
    // });
    await this.ionStorage.storageSet('user',JSON.stringify(user));

    this.loggedUser.next(JSON.stringify(user));
  }

  // check if user is logged in and token is valid
  isLoggedIn(): Observable<boolean> {
    return from(this.getUser())
    .pipe(
      concatMap(user => {
        if (user) { // user is the value returned from the local storage
          return this.validateAuthToken(JSON.parse(user).token)
          .pipe(
            catchError(error => of(error)),
            map(result => {
              if (result.error) {
                // token is expired
                return false;
              }
              else
                // user is logged in and token is valid
                return true;
            })
          )
        } else {
          // there is no logged user
          return of(false);
        }
      })
    );
  }

  loggedUserObservable(): Observable<boolean> {
    return this.loggedUser.asObservable();
  }

  async logOut() {
    // await Storage.remove({ key: 'user' });
    await this.ionStorage.storageRemove('user');
    this.loggedUser.next(null);
  }

  doLogin(username: string, password: string) {
    return this.http.post(environment.wordpress.auth_url, {
      username: username,
      password: password
    });
  }

  doRegister(userData: any, token: string) {
    let header: HttpHeaders;
		header = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post(environment.wordpress.api_url + 'users', userData, {headers:header});
  }

  validateAuthToken(token: string) {
    let header : HttpHeaders = new HttpHeaders({'Authorization': 'Bearer ' + token});
    return this.http.post(environment.wordpress.auth_url + '/validate?token=' + token,
      {}, {headers: header})
  }
}
