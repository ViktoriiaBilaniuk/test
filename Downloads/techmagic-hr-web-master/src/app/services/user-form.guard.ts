import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { UsersService } from './users.service';

@Injectable()
export class UserFormGuard implements CanDeactivate<any> {
  constructor(private usersService: UsersService) { }

  canDeactivate(next, state) {
    if(this.usersService.isFirstTimeExit && this.usersService.isUserFormChanged) {
      this.usersService.isFirstTimeExit = false;

      return confirm('Changes you made may not be saved. Do you really want to leave?');
    } else {
      return true;
    }
  }
}
