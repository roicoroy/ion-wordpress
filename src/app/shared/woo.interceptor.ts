import { Injectable, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './wooApi';


@Injectable()
export class WooInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        private router: Router
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
        // const auth = this.injector.get(AuthService);
        let requestUrl = '';
        // console.log(request.url);
        // const skipUrl = 'https://fae.zra.mybluehost.me/wp-json/wp/v2/posts?page=1&orderby=modified';
        // if (request.url === skipUrl) {
        //     // requestUrl = `${environment.origin}/${request.url}`;
        //     // requestUrl = skipUrl;
        //     requestUrl = request.url;
        // }
        // if (request.url.includes('/wp-json/wp/v2/posts?page=1&orderby=modified')) {
        //     // console.log(`${environment.origin}/${request.url}`);
        //     requestUrl = `${environment.origin}/${request.url}`;
        // }
        // if (request.url.includes('api') || request.url.includes('jwt')) {
        //     requestUrl = `${environment.origin}/${request.url}`;
        // } 
        // else {
        //     requestUrl = `${environment.origin}${environment.wcEndpoint}/${request.url}${this.includeWooAuth(request.url)}`;
        // }
        requestUrl = `${environment.origin}/${request.url}`;
        // console.log('requestUrl', requestUrl);

        authRequest = request.clone({
            url: requestUrl
        });

        return next.handle(authRequest)
            .pipe(
                catchError(err => {
                    if (err instanceof HttpErrorResponse && err.status === 0) {
                        console.log('Check Your Internet Connection And Try again Later');
                    } else if (err instanceof HttpErrorResponse && err.status === 401) {
                    }
                    return throwError(err);
                })
            );
    }
}
