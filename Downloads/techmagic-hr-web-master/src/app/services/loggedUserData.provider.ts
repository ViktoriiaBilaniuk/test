import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UsersService} from './users.service';
import {AuthService} from './auth.service';
import {JwtHelper} from 'angular2-jwt';
import {CookieService} from 'ngx-cookie';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import 'rxjs/add/operator/first';
import 'rxjs/add/operator/do';

@Injectable()
export class LoggedUserDataProvider implements CanActivate {
  constructor(private auth: AuthService,
              private usersService: UsersService,
              private router: Router,
              private jwtHelper: JwtHelper,
              private cookieService: CookieService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
    let jwt = this.cookieService.get('jwt_token');
    let loggedUser = this.auth.getLoggedUserData();
    if (jwt && !loggedUser._id) {
      let userId = this.jwtHelper.decodeToken(jwt).userId;
      return this.usersService.getUser(userId)
      .map(
        user => {
          this.auth.setLoggedUserData(user);
          return true;
        },
        error => {
          console.error('Error: ', error);
          this.router.navigate(['login']);
          return false;
        })
      .first();
    } else {
      return true;
    }
  }
}
