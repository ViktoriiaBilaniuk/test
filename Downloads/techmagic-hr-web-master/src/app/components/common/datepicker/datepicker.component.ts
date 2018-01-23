import { Component, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { DATEPICKER } from '../../../models/datepicker';
import * as moment from 'moment';

@Component({
    selector: 'hr-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.styles.sass']
})

export class DatepickerComponent implements OnInit, OnChanges {
    @Input() years: number[];
    @Input() months: string[];
    @Output() onDateChanged: EventEmitter<DATEPICKER> = new EventEmitter();
    @Output() onYearChanged: EventEmitter<Number> = new EventEmitter();
    public showDatepicker: boolean;
    public year: number;
    public month: number;
    public months4: string[] = [];
    public months8: string[] = [];
    public months12: string[] = [];
    public currentMonth = 0;
    public datepickerText: string;
    constructor() { }

    public ngOnInit() {
        this.convertMonths();
        this.initCurrentYear();
        this.initCurrentMonth();
        // this.datepickerText = `select month`;
        this.selectMonth(this.month);
        this.createInputString();
    }

    public ngOnChanges(changedObj) {
        this.convertMonths();
    }

    public nextYear() {
        if (this.yearsIsDefined()) {
            this.increaseInYearsRange();
        } else {
            this.year++;
        }
        this.createInputString();
        this.onYearChanged.emit(this.year);
    }

    public prevYear() {
        if (this.yearsIsDefined()) {
            this.decreaseInYearsRange();
        } else {
            this.year--;
        }
        this.createInputString();
        this.onYearChanged.emit(this.year);
    }

    public hideDatepicker(event) {
        if (!event.target.classList.contains('hr-datepicker-year-select')) {
            this.showDatepicker = false;
        }
    }

    public selectMonth(index: number) {
        this.currentMonth = index;
        this.generateTime();
    }

    private createInputString() {
        let months: string[] = this.generateMonths();
        this.datepickerText = `${this.formatMonth(months[this.currentMonth])} ${this.year}`;
    }

    private convertMonths() {
        let months: string[] = this.generateMonths();
        this.months4 = [];
        this.months8 = [];
        this.months12 = [];

        for (let i = 0; i < 4; i++) {
            this.months4.push(months[i]);
        }

        for (let i = 4; i < 8; i++) {
            this.months8.push(months[i]);
        }

        for (let i = 8; i < 12; i++) {
            this.months12.push(months[i]);
        }

    }

    private generateMonths(): string[] {
        if (this.months && this.months.length) {
            return this.months;
        } else {
            return [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
        }
    }

    private generateTime() {
        const time = new Date();
        time.setFullYear(this.year);
        time.setMonth(this.currentMonth);
        time.setHours(0);

        this.onDateChanged.emit({
            year: this.year,
            month: this.currentMonth,
            timestamp: time.getTime()
        });
    }

    private increaseInYearsRange() {
        let index: number = this.getCurrentIndexOfArray(this.year, this.years);
        if (this.years[index + 1]) {
            this.year = this.years[index + 1];
        }
    }

    private decreaseInYearsRange() {
        let index: number = this.getCurrentIndexOfArray(this.year, this.years);
        if (this.years[index - 1]) {
            this.year = this.years[index - 1];
        }
    }

    private getCurrentIndexOfArray(current: number, array: any[]) {
        return array.indexOf(current);
    }

    private initCurrentYear() {
        if (this.yearsIsDefined()) {
            this.year = this.years[0];
        } else {
            this.year = new Date().getFullYear();
        }
    }

  private initCurrentMonth() {
      this.month = new Date().getMonth();
  }

    private yearsIsDefined(): boolean {
        return !!(this.years && this.years.length);
    }

    private formatMonth(text): string {
        return text.replace(/\s.+$/g, '');
    }
}
