import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';

import {UsersService} from './users.service';
import {AuthService} from './auth.service';

@Injectable()
export class EmployeesGuard implements CanActivate {
  private userData = this.auth.getLoggedUserData();

  constructor(private auth: AuthService,
              private router: Router,
              private userService: UsersService) {}

  canActivate(next, prev) {
    const loggedUser = this.auth.getLoggedUserData();
    if (loggedUser.role === 0 && loggedUser._id !== next.params.id) {
      this.router.navigate(['employees/list']);
      return false;
    } else {
      return true;
    }
  }
}
