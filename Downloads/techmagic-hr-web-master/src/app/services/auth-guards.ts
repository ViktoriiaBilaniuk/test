import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Http } from '@angular/http';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { MessageService } from './message.service';

const API_ENDPOINT = environment.apiEndpoint;
const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('127239b5e54a51aacf7fac2aaff646e4');

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService,
              private http: Http,
              private router: Router,
              private messageService: MessageService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const href = window.location.href;

    if (href.indexOf('google-auth') !== -1) {
      const query = href.substr(href.indexOf('?'));

      this.http.get(`${API_ENDPOINT}/google-auth${query}`).subscribe((data) => {
        const user = JSON.parse(data['_body']);

        this.auth.setAuthDataToStorage(user);
        this.auth.setLoggedUserData(user);
        this.auth.addUserMixpanel(user);
        localStorage.setItem('selectedCompany', user['_company']);
        this.router.navigate(['employees', 'list']);

        return this.auth.checkAuthorization();
      }, error => {
        if (error.status === 500) {
          this.messageService.openModal({paramsString: 'googleLogin_danger_0'});
          this.router.navigate(['login']);
        }
      });
    } else {
      return this.auth.checkAuthorization();
    }
  }
}
