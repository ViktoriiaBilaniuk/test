import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { SharedCalendarService } from '../../services/shared-calendar.service';
import { SpinnerService } from '../../services/spinner.service';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'hr-shared-calendar',
  templateUrl: './shared-calendar.component.html',
  styleUrls: ['./shared-calendar.component.sass']
})
export class SharedCalendarComponent implements OnInit {
  token: string;
  users: object[];
  calendar: object[];
  project = {name: ''};
  public defaultUserPhoto = '/assets/img/icon-user-default.png';
  private dateRange = {
    dateFrom: new Date(Date.UTC(new Date().getFullYear(), 0, 1)).valueOf(),
    dateTo: new Date(Date.UTC(new Date().getFullYear(), 11, 1)).valueOf()
  };

  constructor(private activatedRoute: ActivatedRoute,
              private sharedCalendarService: SharedCalendarService,
              private spinnerService: SpinnerService,
              private messageService: MessageService) { }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.initDatePicker();

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.token = params['token'];

      this.getUsers();
    }, error => this.spinnerService.hideSpinner());
  }

  isHoliday (currentDay, months) {
    return this.sharedCalendarService.isHoliday(currentDay, months);
  }

  isDayoff (curDate, user, type) {
   return this.sharedCalendarService.isDayoff(curDate, user, type);
  }

  initDatePicker() {
    $('#dateFrom, #dateTo').datepicker({
      autoclose: true,
      format: 'MM yyyy',
      startView: 1,
      minViewMode: 1
    })
      .on('changeDate', (e) => {
        const chosenDate = new Date(Date.UTC(e.date.getFullYear(), e.date.getMonth(), e.date.getDate()));

        if (e.currentTarget.getAttribute('id') === 'dateFrom') {
          this.dateRange.dateFrom = chosenDate.valueOf();
        } else if (e.currentTarget.getAttribute('id') === 'dateTo') {
          let daysInThisMonth = this.getDaysInThisMonth(chosenDate.valueOf());
          this.dateRange.dateTo = chosenDate.setUTCDate(daysInThisMonth).valueOf();
        }

        if (this.dateRange.dateTo >= this.dateRange.dateFrom) {
          this.getUsers();
        } else {
          this.messageService.openModal({paramsString: 'sharedCalendar_warning_0'});
        }
      });
    this.setDefaultDates();
  }

  setDefaultDates() {
    $('input[id="dateFrom"]').datepicker('update', new Date(Date.UTC(new Date().getFullYear(), 0, 1)));
    $('input[id="dateTo"]').datepicker('update', new Date(Date.UTC(new Date().getFullYear(), 11, 1)));
  }

  getDaysInThisMonth (date) {
    let now = new Date(date);
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  getUsers() {
    this.sharedCalendarService.getCalendar(this.token, this.dateRange.dateFrom, this.dateRange.dateTo).subscribe(data => {
      this.users = data.users;
      this.calendar = data.calendar;
      this.project = data.project;

      this.spinnerService.hideSpinner();
    }, error => this.spinnerService.hideSpinner());
  }
}
