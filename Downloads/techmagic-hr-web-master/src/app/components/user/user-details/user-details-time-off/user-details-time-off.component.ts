import {ActivatedRoute} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import * as moment from 'moment';

import {AuthService, UsersService, TimeOffService } from '../../../../services';

import { USER } from './../../../../models';

@Component({
  selector: 'hr-user-details-time-off',
  templateUrl: './user-details-time-off.component.html',
  styleUrls: ['user-details-time-off.component.sass']
})
export class UserDetailsTimeOffComponent implements OnInit {
  availableData = [];
  type: string;
  items = [];
  canEdit = false;
  paidVacDays = 0;
  totalVacDays = 0;
  workingDays = 0;
  totalDays = 0;
  private notAvailableDays = [];
  private tab: string;
  private uid;
  private userData: USER = this.authService.getUserData();
  private isPaid = true;
  isLead = false;
  admin = false;
  hasCrossDates = false;
  calendarDays = 0;
  errorMessage = '';
  public currentYear;
  public nextYear;
  public range = {};

  constructor(private authService: AuthService,
              private usersService: UsersService,
              private timeOffService: TimeOffService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.getParams();
    this.isCanEdit();
  }

  getParams() {
    this.activatedRoute.parent.params.subscribe(
      (params) => {
        this.uid = params['id'];
        this.getRangeDate(params['id']);
      }
    );
    this.activatedRoute.data.subscribe(
      (params) => {
        this.type = params.name;
        this.tab = params.tab;
      }
    );
  }

  isCanEdit() {
    // Lead this User
    this.usersService.getUser(this.uid).subscribe(
      res => {
        if ((res._lead._id && res && res._lead && res._lead._id === this.userData._id) && (this.uid !== this.userData._id)) {
          this.isLead = true;
        }
      },
      error => console.error('Error: ', error)
    );

    // This user
    if (this.uid === this.userData._id) {
      this.canEdit = true;
    }

    // Admin
    if (this.userData.role > 0) {
      this.canEdit = true;
      this.admin = true;
    }
  }

  getRangeDate(id) {
    this.timeOffService.getDates(id).subscribe(
      res => {
        this.availableData = res;
        this.currentYear = {
          to: new Date(res[0].dateTo).getTime(),
          from: new Date(res[0].dateFrom).getTime(),
          displayTo: moment.utc(res[0].dateTo).format('MMM DD, YYYY'),
          displayFrom: moment.utc(res[0].dateFrom).format('MMM DD, YYYY')
        };

        this.nextYear = {
          to: new Date(res[1].dateTo).getTime(),
          from: new Date(res[1].dateFrom).getTime(),
          displayTo: moment.utc(res[1].dateTo).format('MMM DD, YYYY'),
          displayFrom: moment.utc(res[1].dateFrom).format('MMM DD, YYYY')
        };

        this.getAvailableDays();

      },
      error => console.error('Error: ', error)
    );
  }

  getAvailableDays() {
    let param = this.generateQueryParam();

    const sub1 = this.timeOffService.getTotalDays(this.type, this.uid, param);
    const sub2 = this.timeOffService.getNotAvailableDays(this.uid, param);

    Observable.combineLatest(sub1, sub2).subscribe(
      (data) => {

        this.paidVacDays = data[0].paid;
        this.totalVacDays = data[0].total;
        this.notAvailableDays = data[1];

        this.initDatePicker();
        this.getItems();

      },
      error => console.error('Error: ', error)
    );
  }

  generateQueryParam() {
    let param = '';
    if (this.tab === 'next') {
      param += `dateFrom=${this.nextYear.from}&dateTo=${this.nextYear.to}`;
    } else {
      param += `dateFrom=${this.currentYear.from}&dateTo=${this.currentYear.to}`;
    }
    return param;
  }

  initDatePicker() {
    const optDatepicker = {
      autoclose: true,
      datesDisabled: this.notAvailableDays,
      weekStart: 1,
      daysOfWeekDisabled: [0, 6],
      daysOfWeekHighlighted: '0,6',
      todayHighlight: true,
      format: 'dd/mm/yyyy'
    };

    if (this.tab === 'current') {
      optDatepicker['startDate'] = moment.utc(this.currentYear.from).format('DD/MM/YYYY');
      optDatepicker['endDate'] = moment.utc(this.currentYear.to).format('DD/MM/YYYY');
    } else if (this.tab === 'next') {
      optDatepicker['startDate'] = moment.utc(this.nextYear.from).format('DD/MM/YYYY');
      optDatepicker['endDate'] = moment.utc(this.nextYear.to).format('DD/MM/YYYY');
    }

    if (this.admin) {
      if (this.tab === 'current') {
        optDatepicker['startDate'] = moment.utc(this.currentYear.from).format('DD/MM/YYYY');
        optDatepicker['endDate'] = moment.utc(this.currentYear.to).format('DD/MM/YYYY');
      }
    } else {
      if (this.tab === 'current') {
        optDatepicker['startDate'] = moment.utc().format('DD/MM/YYYY');
      } else if (this.tab === 'next') {
        optDatepicker['startDate'] = moment.utc(this.nextYear.from).format('DD/MM/YYYY');
      }
    }
    this.addDatePickerOnChangeEvent(optDatepicker);
  }

  addDatePickerOnChangeEvent(optDatepicker) {
    $('.input-daterange').datepicker(optDatepicker).on('changeDate', (e) => {
      const one = new Date($('#startDate').datepicker('getUTCDate')).setUTCHours(0, 0, 0, 0);
      const two = new Date($('#endDate').datepicker('getUTCDate')).setUTCHours(23, 59, 59, 999);
      this.hasCrossDates = false;
      if (this.errorMessage !== '') {
        this.errorMessage = '';
      }

      for (const item of this.notAvailableDays) {
        const today = moment.utc(item, 'DD-MM-YYYY').valueOf();
        if (typeof today === 'number' && today > one && today < two) {
          this.hasCrossDates = true;
          break;
        }
      }

      if (!this.hasCrossDates) {
        this.range['dateFrom'] = one;
        this.range['dateTo'] = two;
        this.range['displayFrom'] = moment.utc(one).format('MMM DD, YYYY');
        this.range['displayTo'] = moment.utc(two).format('MMM DD, YYYY');

        if (e.target.getAttribute('id') === 'startDate') {
          this.getDaysLength();
        } else if (e.target.getAttribute('id') === 'endDate') {
          this.getDaysLength();
        }
      }

    });
  }

  getDaysLength() {
    this.timeOffService
      .getCalculateDays(this.uid, `dateFrom=${this.range['dateFrom']}&dateTo=${this.range['dateTo']}`)
      .subscribe(
        ((daysObj) => {
          this.calendarDays = daysObj.totalDays;
          this.workingDays = daysObj.workingDays;
        }),
        (error) => console.error('Error ', error)
      );
  }

  resetForm() {
    const pick = $('.input-daterange');
    pick.datepicker('remove');
    pick.off();
    pick.find('input').off();
    pick.find('input').val('');
    this.workingDays = 0;
    this.calendarDays = 0;
    this.range = {};
  }

  getItems() {
    let param = this.generateQueryParam();

    this.timeOffService.getRequestedItemsForUser(this.uid, param, this.type).subscribe(
      (data) => {
        const today = new Date().valueOf();
        data.forEach(element => {
          const dateFrom = new Date(element.dateFrom).valueOf();
          element['disabled'] = today > dateFrom;
        });

        this.items = data;
      },
      error => console.error('Error: ', error)
    );
  }

  addItem(range) {
    if (this.userData.role === 2) {
      range['isAccepted'] = true;
    } else if (this.userData.role === 1 && this.uid !== this.userData._id) {
      range['isAccepted'] = this.admin;
    }

    range['_user'] = this.uid;
    range['isPaid'] = true;

    this.timeOffService.createItem(this.type, range).subscribe(
      res => {
        if (this.errorMessage !== '') {
          this.errorMessage = '';
        }
        this.resetForm();
        this.getAvailableDays();
      },
      error => {
        console.error('Error: ', error);
        let body = JSON.parse(error._body);
        this.errorMessage = body.message;
      }
    );
  }

  removeItem(type, item) {

    this.timeOffService.removeItem(type, item._id).subscribe(
      res => {
        this.resetForm();
        this.getAvailableDays();
      },
      error => console.error('Error: ', error)
    );
  }

  approveItem(type, id, status) {

    this.timeOffService.confirmItem(type, id, status).subscribe(
      res => {
        this.resetForm();
        this.getAvailableDays();
      },
      error => console.error('Error: ', error)
    );
  }


}
