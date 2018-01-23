import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {HOLIDAY} from '../../../models/holiday';
import {HolidaysService, SpinnerService} from '../../../services';

@Component({
  selector: 'hr-holidays-list',
  templateUrl: 'holidays-list.component.html',
  styleUrls: ['holidays-list.component.sass']
})
export class HolidaysListComponent implements OnInit, OnDestroy {
  holidays: HOLIDAY[];
  holidaysYears: Number[];
  chosenHolidayYear: String;
  private subscription: Subscription;

  constructor(private holidaysService: HolidaysService,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.getHolidaysYears();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.spinnerService.hideSpinner();
  }

  getHolidaysYears() {
    this.subscription = this.holidaysService.getHolidaysYears().subscribe(
      (res) => {
        this.holidaysYears = res;
        if (!this.chosenHolidayYear) {
          this.setCurrentYear();
        }
        this.getHolidays();
        this.spinnerService.hideSpinner();
      },
      (error) => {
        console.error('Error: ', error);
        this.spinnerService.hideSpinner();
      }
    );
  }

  setCurrentYear() {
    const currentYear = new Date().getUTCFullYear();
    if (this.holidaysYears.find(y => y === currentYear) || !this.holidaysYears[0]) {
      this.chosenHolidayYear = '' + (currentYear);
    } else {
      this.chosenHolidayYear = '' + this.holidaysYears[0];
    }
  }

  getHolidays() {
    this.subscription = this.holidaysService.getHolidays(this.chosenHolidayYear).subscribe(
      (data) => this.holidays = data,
      (error) => console.error('Error: ', error)
    );
  }
}
