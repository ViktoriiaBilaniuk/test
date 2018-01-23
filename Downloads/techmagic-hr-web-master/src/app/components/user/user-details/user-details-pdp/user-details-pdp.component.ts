import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UsersService, SpinnerService } from '../../../../services';
import { AuthService, } from './../../../../services';

import { USER } from './../../../../models';

@Component({
  selector: 'hr-user-details-pdp',
  templateUrl: 'user-details-pdp.component.html',
  styleUrls: ['user-details-pdp.component.sass']
})

export class UserDetailsPdpComponent implements OnInit {
  public user: USER;
  public pdps: number[];
  public datepickers: any[] = [];
  public pdpDate: any;
  public loggedUserData = this.auth.getLoggedUserData();

  constructor(private activetedRoute: ActivatedRoute,
    private usersService: UsersService,
    private auth: AuthService,
    private spinnerService: SpinnerService) {

  }

  ngOnInit() {
    this.user = this.usersService.getStoredUser();
  }

  updatePdps(dateObject) {
    console.log('dateObject: ', dateObject);
    let dat = new Date(dateObject.timestamp);
    dat.setUTCHours(0, 0, 0, 0);
    dat.setDate(1);
    this.pdpDate = new Date(dat).setUTCHours(0, 0, 0, 0);
    console.log('pdpDate:', this.pdpDate);
  }

  savePdps() {
    const previousPdps: number[] = this.convertTimestamp(this.user.pdps);
    this.updateUsers(previousPdps.concat(this.pdpDate));
  }

  removePdp(index) {
    const previousPdps: number[] = this.convertTimestamp(this.user.pdps);
    previousPdps.splice(index, 1);
    this.updateUsers(previousPdps);
  }

  filterDates(datesArray: string[]) {
    function sortNumber(a, b) {
      return a - b;
    }

    const timestampsArray: number[] = this.convertTimestamp(datesArray);

    return timestampsArray.sort((a, b) => { return a - b; });
  }

  private updateUsers(pdps: number[]) {
    this.usersService.updateUser({ pdps }, this.user._id).subscribe(data => {
      this.user = data;
      this.datepickers = [];
      this.pdpDate = null;
    }, error => {
      console.log('error: ', error);
    });
  }


  private convertTimestamp(dates: any[]): number[] {
    return dates.map(date => { return new Date(date).getTime(); });
  }

}
