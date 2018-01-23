import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, OnDestroy} from '@angular/core';

import {HolidaysService} from './../../../services';

@Component({
  selector: 'hr-holidays-form-component',
  templateUrl: 'holidays-form.component.html',
  styleUrls: ['holidays-form.component.sass']
})
export class HolidaysFormComponent implements OnInit, OnDestroy {
  holidayId: string;
  holiday = {
    name: '',
    date: null
  };
  private subscription;

  constructor(private holidaysService: HolidaysService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.holidayId = param['id'];
        if (this.holidayId) {
          this.getHolidayInfo();
        }
      },
      error => console.error('Error: ', error)
    );

    this.initDatePicker();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getHolidayInfo() {
    this.subscription = this.holidaysService.getHoliday(this.holidayId).subscribe(
      holiday => {
        this.holiday = holiday;
        this.setDate();
      },
      error => console.error('Error', error)
    );
  }

  /**
   * @description - Handle form submit
   * @memberOf HolidaysFormComponent
   */
  onSubmit(): void {
    if (this.holiday.name && $('#date').datepicker('getDate')) {
      this.holiday.date = new Date($(`#date`).datepicker('getUTCDate')).getTime();
      if (this.holidayId) {
        this.updateHoliday();
      } else {
        this.addHoliday();
      }
    }
  }

  addHoliday() {
    this.subscription = this.holidaysService.addHoliday(this.holiday).subscribe(
      () => this.router.navigate(['holidays/list']),
      error => console.error('Error: ', error)
    );
  }

  updateHoliday() {
    this.subscription = this.holidaysService.updateHoliday(this.holiday).subscribe(
      () => this.router.navigate(['holidays/list']),
      error => console.error('Error: ', error)
    );
  }



  onDeleteHoliday(id) {
    this.subscription = this.holidaysService.deleteHoliday(id).subscribe(
      () => this.router.navigate(['holidays/list']),
      error => console.error('Error: ', error)
    );
  }

  setDate() {
    $('#date').datepicker('setUTCDate', new Date(this.holiday.date));
  }

  initDatePicker() {
    $('#date').datepicker({
      todayHighlight: true,
      weekStart: 1,
      // daysOfWeekHighlighted: '0,6',
      autoclose: true,
      format: 'dd/mm/yyyy'
    });
  }
}
