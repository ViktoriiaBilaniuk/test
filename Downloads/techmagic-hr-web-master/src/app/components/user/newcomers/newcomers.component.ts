import { Component, OnInit } from '@angular/core';

import { UsersService } from '../../../services/users.service';
import { SpinnerService } from '../../../services/spinner.service';
import { USER } from '../../../models/user';

@Component({
  selector: 'hr-newcomers',
  templateUrl: './newcomers.component.html',
  styleUrls: ['./newcomers.component.sass']
})
export class NewcomersComponent implements OnInit {
  users: USER[];

  constructor(private usersService: UsersService,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.usersService.getNewcomers().subscribe((data => {
      this.users = data.docs;
      this.spinnerService.hideSpinner();
    }), error => {
      this.spinnerService.hideSpinner();
    });
  }
}
