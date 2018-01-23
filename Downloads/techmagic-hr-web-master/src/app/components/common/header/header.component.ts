import {Component} from '@angular/core';

import {AuthService} from './../../../services';

@Component({
  selector: 'hr-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.sass']
})
export class HeaderComponent {
  loggedUserData = this.auth.getLoggedUserData();
  defaultUserPhoto = '/assets/img/icon-user-default.png';

  constructor(private auth: AuthService) {}

  logOut(): void {
    this.auth.logOut();
  }
}
