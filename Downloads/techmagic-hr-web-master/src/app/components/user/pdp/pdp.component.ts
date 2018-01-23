import { Component, OnInit } from '@angular/core';
import { UsersService, SpinnerService } from './../../../services/';
import { USER, PDP, DATEPICKER } from '../../../models/';
import * as moment from 'moment';

@Component({
    selector: 'hr-birthdays',
    templateUrl: './pdp.component.html'
})

export class PDPComponent implements OnInit {
    public yearSelect: any;
    public monthSelect: any;
    public years: string[];
    public months: string[];
    public pdpUsers: USER[];
    public users: PDP;
    private currentYear: string = moment(new Date()).format('YYYY');
    private currentMonth: string = moment(new Date()).format('MM');

    constructor(
        private usersService: UsersService,
        private spinnerService: SpinnerService) {

    }

    ngOnInit() {
        this.getUsers();
    }

    selectPdpUsers(timeObject: DATEPICKER) {
        if (this.users.active && Object.keys(this.users.active).length) {
            this.pdpUsers = this.users.active[timeObject.year][timeObject.month].users;
            this.months = this.selectMonths(timeObject.year);
            console.log('this.months: ', this.months);
        }
    }

    getUsers() {
        this.spinnerService.showSpinner();
        this.usersService.getUsersByPdp().subscribe(
            data => {
                this.users = data;
                if (this.pdpUsersExists()) {
                    this.years = Object.keys(this.users.active);
                    this.months = this.selectMonths(this.years[0]);
                }
                this.spinnerService.hideSpinner();
                this.selectPdpUsers({
                  year: +this.currentYear,
                  month: +this.currentMonth,
                  timestamp: new Date().getTime()
                })
            },
            error => {
                console.error('Error: ', error);
                this.spinnerService.hideSpinner();
            });
    }

    private pdpUsersExists(): boolean {
        let objKeys: string[] = Object.keys(this.users.active);
        return !!(this.users.active && objKeys.length);
    }

    private selectMonths(year: string | number = this.currentYear): string[] {
        const months = this.users.active[year];
        let monthsList: string[] = [];

        months.forEach(obj => {
            monthsList.push(`${obj.name} (${obj.users.length})`);
        });

        return monthsList;
    }

    public calculateMonths(year: string | number = this.currentYear) {
      this.months = this.selectMonths(year);
    }

}
