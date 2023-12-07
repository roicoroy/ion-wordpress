import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Store } from '@ngxs/store';
import { ErrorLoggingActions } from 'src/app/store/errors-logging/errors-logging.actions';

@Injectable({
  providedIn: 'root'
})
export class WoocommerceHelperService {

  private store = inject(Store);

  handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
    } else {
      this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(error));
      return new Observable(obs => obs.error(error.error));
    }
    // return an observable with a user-facing error message
    return new Observable(obs => obs.error({
      message: 'Something bad happened; please try again later.'
    }));

  }

  includeQuery(query: any = {}): any {
    const queryPatch: any = {};
    Object.keys(query).forEach(key => {
      queryPatch[key] = query[key].toString();
    });
    return queryPatch;
  }

  includeEncoded(query: any = {}): any {
    const params = new FormData();
    Object.keys(query).forEach((key) => {
      params.append(key, query[key]);
    });
    return params;
  }

  includeResponseHeader(response: any, responseBodyKey?: string): any {
    const headers: any = {};
    response.headers.keys().forEach((key: any) => {
      headers[key] = response.headers.get(key);
    });
    let responseData: any = {};
    if (responseBodyKey) {
      responseData[responseBodyKey] = response.body;
    } else {
      responseData = response.body;
    }
    responseData.headers = headers;
    return responseData;
  }
}
