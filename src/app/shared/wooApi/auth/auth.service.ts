import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, concatMap, map } from 'rxjs/operators';

import { WoocommerceHelperService } from '../helper.service';
import { CreateNonce, CreateNonceRes, RegisterPayload, LoginPayload } from './auth.interface';
import { Observable, Subject, from, of } from 'rxjs';
import { Store } from '@ngxs/store';
import { IStoreSnapshoModel } from 'src/app/store/store.snapshot.interface';
import { IonStorageService } from '../../utils/ionstorage.service';
import { environment } from 'src/environments/environment';
import { IUserResponseModel } from 'src/app/store/auth/auth.state';

// Plugins used https://wordpress.org/plugins/json-api-user/

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // private loggedUser: Subject<any> = new Subject<any>();

  private store = inject(Store);

  private http = inject(HttpClient);

  private ionStorage = inject(IonStorageService);

  constructor(
    private httpClient: HttpClient,
    private wooHelper: WoocommerceHelperService
  ) { }

  createNonce(payload: CreateNonce): Observable<any> {
    return this.httpClient.get(`api/get_nonce/`, { params: this.wooHelper.includeQuery(payload) })
      .pipe(catchError((err: any) => this.wooHelper.handleError(err)));
  }

  register(registerData?: RegisterPayload): Observable<any> {
    const postMockData = {
      username: 'test1',
      email: 'test1@email.com',
      password: 'Rwbento123!'
    }
    const payload = this.wooHelper.includeEncoded(postMockData);
    return this.httpClient.post('wp-json/wp/v2/users', payload)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  doRegister(userData: any, token: string | any) {
    let header: HttpHeaders;
    const postMockData = {
      username: 'test1',
      email: 'test1@email.com',
      password: 'Rwbento123!'
    }
    header = new HttpHeaders({ "Authorization": "Bearer " + token });
    return this.http.post(environment.wordpress.api_url + 'users', postMockData, { headers: header })
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  retrievePassword(username: string): Observable<any> {
    const payload = this.wooHelper.includeEncoded({ user_login: username });
    return this.httpClient.post(`api/user/retrieve_password/`, payload)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  getAuthToken(payload: LoginPayload): Observable<any> {
    return this.httpClient.post(`wp-json/jwt-auth/v1/token`, payload)
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  generateAuthCookie(data: LoginPayload): Observable<any> {
    return this.httpClient.post(`api/user/generate_auth_cookie/`, this.wooHelper.includeEncoded(data))
      .pipe(catchError(err => this.wooHelper.handleError(err)));
  }


  async getUser() {
    const value = await this.ionStorage.storageGet('user');
    return value;
  }

  async setUser(user: any) {
    await this.ionStorage.storageSet('user', user);
  }

  async getUserOb() {
    const user = this.store.selectSnapshot((state: IStoreSnapshoModel) => state.auth.user);
    return user;
  }

  // // check if user is logged in and token is valid
  // isLoggedIn(): Observable<boolean> {
  //   return from(this.getUserOb())
  //     .pipe(
  //       concatMap((user: IUserResponseModel | any) => {
  //         // console.log(user);
  //         if (user) { // user is the value returned from the local storage
  //           return this.validateAuthToken(user.token)
  //             .pipe(
  //               catchError(error => of(error)),
  //               map(result => {
  //                 if (result.error) {
  //                   // token is expired
  //                   return false;
  //                 }
  //                 else
  //                   // user is logged in and token is valid
  //                   return true;
  //               })
  //             )
  //         } else {
  //           // there is no logged user
  //           return of(false);
  //         }
  //       })
  //     );
  // }

  doLogin(username: string, password: string) {
    return this.http.post(environment.wordpress.auth_url, {
      username: username,
      password: password
    });
  }

  validateAuthToken(token: string) {
    let header: HttpHeaders = new HttpHeaders({ 'Authorization': 'Bearer ' + token });
    return this.http.post(environment.wordpress.auth_url + '/validate?token=' + token,
      {}, { headers: header })
  }
}
