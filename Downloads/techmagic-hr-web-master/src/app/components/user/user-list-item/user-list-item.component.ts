import {Component, DoCheck, Input} from '@angular/core';
import * as moment from 'moment';

import {USER} from './../../../models';

@Component({
  selector: 'hr-user-list-item',
  templateUrl: 'user-list-item.component.html',
  styleUrls: ['user-list-item.component.sass']
})
export class UserListItemComponent implements DoCheck{
  @Input() user: USER;
  @Input() currentUserRole: number;
  @Input() pdp: string;
  isWorkStarted = true;
  defaultUserPhoto = '/assets/img/icon-user-default.png';

  ngDoCheck() {
    if (this.user.firstWorkingDay) {
      this.isWorkStarted = moment().isSameOrAfter(this.user.firstWorkingDay);
    }
  }
}
