import { Injectable } from '@angular/core';
import {
  Http,
  RequestOptions,
  RequestOptionsArgs,
  Request,
  Response, XHRBackend
} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import {CookieService} from 'ngx-cookie';

@Injectable()
export class HttpInterceptor extends Http {

  constructor(backend: XHRBackend,
              defaultOptions: RequestOptions,
              private _cookieService: CookieService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    return super.request(url, options).catch(this.catchErrors());
  }

  private catchErrors() {
    return (res: Response) => {
      if (res.status === 401 || res.status === 403) {
        localStorage.clear();
        this._cookieService.removeAll();
        location.reload();
      }

      return Observable.throw(res);
    };
  }
}
