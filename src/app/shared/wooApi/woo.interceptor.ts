import { Injectable, Injector, inject } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService, WoocommerceHelperService } from '.';
import { Store } from '@ngxs/store';
import { IStoreSnapshoModel } from '../../store/store.snapshot.interface';


@Injectable()
export class WooInterceptor implements HttpInterceptor {
    private wooHelper = inject(WoocommerceHelperService);

    constructor(
        private injector: Injector,
        private router: Router,
        private store: Store,
    ) { }

    private includeWooAuth(url: string): string {
        const wooAuth = `consumer_key=${environment.woocommerce.consumer_key}&consumer_secret=${environment.woocommerce.consumer_secret}`;
        const hasQuery = url.includes('?');
        let returnUrl = '';
        if (hasQuery) {
            returnUrl = wooAuth;
        } else {
            returnUrl = '?' + wooAuth;
        }
        return returnUrl;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


        let authRequest;
        let requestUrl = '';
        const token = this.store.selectSnapshot((state: IStoreSnapshoModel) => state.auth.user?.token);

        if (request.url.includes('i18n')) {
            authRequest = request.clone({
                url: request.url
            });
            return next.handle(authRequest)
                .pipe(
                    catchError(err => {
                        if (err instanceof HttpErrorResponse && err.status === 0) {
                            this.wooHelper.handleError(err);
                        } else if (err instanceof HttpErrorResponse && err.status === 401) {
                            this.wooHelper.handleError(err);
                        }
                        return throwError(err);
                    })
                );
        }
        if (request.url.includes('simple-jwt-login')) {
            requestUrl = `${environment.origin}/${request.url}`;
            authRequest = request.clone({
            });
        }
        if (request.url.includes('api') || request.url.includes('jwt') || request.url.includes('wp-json')) {
            requestUrl = `${environment.origin}/${request.url}`;
            if (token) {
                authRequest = request.clone({
                    headers: new HttpHeaders({ "Authorization": "Bearer " + token }),
                    url: requestUrl
                });
            } else {
                authRequest = request.clone({
                    url: requestUrl
                });
            }
        }
        if (request.url.includes('products')) {
            requestUrl = `${environment.origin}${environment.wcEndpoint}/${request.url}${this.includeWooAuth(request.url)}`;
            authRequest = request.clone({
                url: requestUrl
            });
        } else {
            authRequest = request.clone({
                url: `${environment.origin}/${request.url}`
            });
        }

        return next.handle(authRequest)
            .pipe(
                catchError(err => {
                    if (err instanceof HttpErrorResponse && err.status === 0) {
                        this.wooHelper.handleError(err);
                    } else if (err instanceof HttpErrorResponse && err.status === 401) {
                        this.wooHelper.handleError(err);
                    }
                    return throwError(err);
                })
            );
    }
}
