import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie';

@Injectable()
export class LoggedUserGuard implements CanActivate {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.cookieService.get('jwt_token')) {
      this.router.navigate(['employees/list']);
      return false;
    } else {
      return true;
    }
  }
}
