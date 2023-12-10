import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { WoocommerceHelperService } from '../helper.service';
import { CreateNonce, RegisterPayload, LoginPayload } from './auth.interface';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { IStoreSnapshoModel } from 'src/app/store/store.snapshot.interface';
import { IonStorageService } from '../../utils/ionstorage.service';
import { environment } from 'src/environments/environment';

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
    return this.httpClient.post('wp-json/wp/v2/users/register/', registerData);
      // .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  login(username: string, password: string) {
    let header: HttpHeaders;
    header = new HttpHeaders({
      'Content-type': 'application/json'
    });
    const url = `wp-json/jwt-auth/v1/token`
    return this.http.post(url, {
      username,
      password
    }, { headers: header });
      // .pipe(catchError(err => this.wooHelper.handleError(err)));
  }

  retrievePassword(username: string): Observable<any> {
    // const payload = this.wooHelper.includeEncoded({ username: username });
    return this.httpClient.post(`wp-json/wp/v2/users/lostpassword/`, {
      user_login: username
    });
    // .pipe(catchError(err => this.wooHelper.handleError(err)));
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
