import { Component, DoCheck } from '@angular/core';
import * as moment from 'moment';

import { UsersService, AuthService } from './../../../../services';
import { USER } from './../../../../models';

@Component({
  selector: 'hr-user-details-personal',
  templateUrl: './user-details-personal.component.html',
  styleUrls: ['user-details-personal.component.sass']
})
export class UserDetailsPersonalComponent implements DoCheck{
  private loggedUserData: USER = this.auth.getLoggedUserData();
  user = this.usersService.getStoredUser();
  currentUserId = this.loggedUserData._id;
  currentUserRole = this.loggedUserData.role;
  isWorkStarted = true;

  constructor(private usersService: UsersService, private auth: AuthService) { }

  ngDoCheck() {
    if (this.user.firstWorkingDay) {
      this.isWorkStarted = moment().isSameOrAfter(this.user.firstWorkingDay);
    }
  }
}
