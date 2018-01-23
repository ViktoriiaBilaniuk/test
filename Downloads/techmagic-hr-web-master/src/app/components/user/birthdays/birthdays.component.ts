import {Component, OnInit} from '@angular/core';
import {UsersService, SpinnerService} from './../../../services/';

@Component({
  selector: 'hr-birthdays',
  templateUrl: './birthday.component.html',
  styleUrls: ['birthday.component.sass']
})
export class BirthdaysComponent implements OnInit {
  monthes;
  selectedMonth;

  constructor(private userService: UsersService,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.userService.getUsersBirthdays().subscribe(
      (data) => {
        this.monthes = data;
        this.selectedMonth = data[0];
        this.spinnerService.hideSpinner();
      },
      (error) => {
        console.error('Error: ', error);
        this.spinnerService.hideSpinner();
      }
    );
  }
}
