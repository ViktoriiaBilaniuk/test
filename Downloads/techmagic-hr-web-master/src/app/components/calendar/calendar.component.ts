import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import * as moment from 'moment';

import {
  CalendarService,
  SpinnerService,
  TimeOffService,
  DepartmentsService,
  UsersService,
  ProjectsService,
  AuthService
} from '../../services';
import {DEPARTMENT, PROJECT} from '../../models';

@Component({
  selector: 'hr-app-calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.sass']
})
export class CalendarComponent implements OnInit, OnDestroy {
  users;
  monthsArr;
  calendarShareLink: string;
  departmentFilter = '';
  public myTeam = false;
  public defaultUserPhoto = '/assets/img/icon-user-default.png';
  isModalOpen = false;
  projectFilter = '';
  temporaryModalObj;
  departments: DEPARTMENT[];
  projects: PROJECT[];
  confirmedColors = {
    'vacation': 'rgb(62, 201, 97)',
    'illness': 'rgb(100, 173, 245)',
    'day off': 'rgb(202, 140, 212)',
    'business trip': 'rgb(255, 110, 15)'
  };
  private dateRange = {
    // dateFrom: new Date(Date.UTC(new Date().getFullYear(), 0, 1)).valueOf(),
    // dateTo: new Date(Date.UTC(new Date().getFullYear(), 11, 1)).valueOf()
    dateFrom: +moment.utc().subtract(6, 'months').startOf('month').format('x'),
    dateTo: +moment.utc().add(6, 'months').endOf('month').format('x')
  };
  private loggedUser = this.auth.getLoggedUserData();
  private subscription: Subscription;

  constructor(private spinnerService: SpinnerService,
              private calendarService: CalendarService,
              private timeOffService: TimeOffService,
              private departmentService: DepartmentsService,
              private projectService: ProjectsService,
              private usersService: UsersService,
              private auth: AuthService) {
  }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.getUsers();
    this.getDepartments();
    this.getProjects();

    this.initDatePicker();
  }

  ngOnDestroy() {
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  }

  getUsers() {
    this.spinnerService.showSpinner();
    let sub1 = this.usersService.getUsersCalendar(this.projectFilter, this.departmentFilter, this.myTeam);
    let sub2 = this.timeOffService.getRequestedItems(
      `isPaid=${true}&dateFrom=${this.dateRange.dateFrom}&dateTo=${this.dateRange.dateTo}`, 'vacation'
    );
    let sub3 = this.timeOffService.getRequestedItems(
      `dateFrom=${this.dateRange.dateFrom}&dateTo=${this.dateRange.dateTo}`, 'illness'
    );
    let sub4 = this.timeOffService.getRequestedItems(
      `isPaid=${false}&dateFrom=${this.dateRange.dateFrom}&dateTo=${this.dateRange.dateTo}`, 'vacation'
    );
    let sub5 = this.timeOffService.getRequestedItems(
      `dateFrom=${this.dateRange.dateFrom}&dateTo=${this.dateRange.dateTo}`, 'businessTrip'
    );

    const subscription = Observable.combineLatest(sub1, sub2, sub3, sub4, sub5).subscribe(
      (data) => {
        const users = data[0].docs;
        const vacations = data[1];
        const illness = data[2];
        const dayoff = data[3];
        const businessTrip = data[4];

        this.users = this.transformUsers(users);

        this.generateTimeOffArraysForUsers(vacations, '_vacations');
        this.generateTimeOffArraysForUsers(illness, '_illness');
        this.generateTimeOffArraysForUsers(dayoff, '_dayoff');
        this.generateTimeOffArraysForUsers(businessTrip, '_businessTrip');

        this.getHolidays();
        this.spinnerService.hideSpinner();
        subscription.unsubscribe();
      },
      error => console.error('Error: ', error)
    );
  }

  transformUsers(users) {
    users.map(user => {
      user._vacations = [];
      user._illness = [];
      user._dayoff = [];
      user._businessTrip = [];
      user.wholeName = user.firstName + ' ' + user.lastName;
      return user;
    });
    return users;
  }

  generateTimeOffArraysForUsers(timeOffTypeArr, nameOfArr) {
    timeOffTypeArr.forEach((item) => {
      const indexOfUser = this.users.findIndex(user => user._id === item._user);
      if (indexOfUser !== -1) {
        this.users[indexOfUser][nameOfArr].push(item);
      }
    });
  }

  getHolidays() {
    this.subscription = this.timeOffService.getMonthsWithHolidays(this.dateRange).subscribe(
      (data) => {
        document.getElementById('calendar-body').innerHTML = '';
        this.monthsArr = data;
        if (this.users && this.users.length) {
          this.startTableDrawingProcess();
        }
      },
      (error) => console.error('Error: ', error)
    );
  }

  startTableDrawingProcess() {
    let body = this.calendarService.generateCalenderBody(this.users, this.monthsArr);
    this.addVacationSelectListener(body);
    this.scrollToCurrentMonth();
    this.addSynchronisedScroll();
    this.normalizeHeightScroll();
  }

  addSynchronisedScroll() {
    $('#calendar-name__list, #calendar-body').on('scroll', function (e) {
      $('#calendar-name__list, #calendar-body').scrollTop($(this).scrollTop());
    });
  }

  normalizeHeightScroll() {
    let calendarBodyHeight = document.getElementById('calendar-body').offsetHeight;
    document.getElementById('calendar-name__list').style.maxHeight = calendarBodyHeight + 'px';
  }

  addVacationSelectListener(body) {
    $(body).on('click', '.cell', (e) => {
      const cell = $(e.target);
      if (cell.hasClass('cell_holiday') || cell.hasClass('cell_weekend')) {
        return false;
      } else {
        const id = cell.attr('data-id');
        const userId = cell.attr('data-user-id');
        const user = this.users.find(item => item._id === userId);
        let timeOffInDay;

        if (user) {
          if (user._lead._id !== this.loggedUser._id) {
            return null;
          }

          if (cell.hasClass('cell_illness')) {
            timeOffInDay = 'illness';
          } else if (cell.hasClass('cell_vacation')) {
            timeOffInDay = 'vacations';
          } else if (cell.hasClass('cell_day-off')) {
            timeOffInDay = 'day off';
          } else if (cell.hasClass('cell_business-trip')) {
            timeOffInDay = 'business trip';
          }

          if (timeOffInDay) {
            this.setTemporaryObj(timeOffInDay, user, id);
            (<any>$('#confirmation_modal')).modal();
          }
        }
      }
    });
  }

  setTemporaryObj(subject, user, timeOfId) {
    let pluralDayOffType = subject;
    if (pluralDayOffType === 'vacations') {
      pluralDayOffType = 'vacation';
    }
    if (subject === 'business trip') {
      subject = 'business Trip';
    }
    this.temporaryModalObj = {
      title: `Please confirm or reject user ${pluralDayOffType}`,
      target: `${user.wholeName} is requesting ${pluralDayOffType} on this period:`,
      user: user,
      action: user[`_${subject.replace(' ', '')}`].find(item => item._id === timeOfId),
      actionName: pluralDayOffType
    };
  }

  onTimeOffResolve(item, result) {
    let dbActionType = item.actionName === 'day off' ? 'vacation' : item.actionName;
    if (dbActionType === 'business trip') {
      dbActionType = 'businessTrip';
    }
    this.timeOffService.confirmItem(dbActionType, item.action._id, result).subscribe(
      () => this.handleTimeOffResolve(item.action._id, result, this.confirmedColors[item.actionName]),
      (err) => console.error('Error: ', err)
    );
  }

  handleTimeOffResolve(itemId, result, confirmedColor) {
    $('#calendar-body')
      .find(`.cell[data-id="${itemId}"]`)
      .css('background', result ? confirmedColor : 'rgb(150, 176, 163)');
  }

  scrollToCurrentMonth() {
    let pixelCount = 0;
    const sizeOfCell = 28;
    const monthBorder = 0;

    const currentMonthIndex = this.monthsArr.findIndex((month) => month.isCurrent);
    if (currentMonthIndex !== -1) {
      for (let i = 0; i < this.monthsArr.length; i++) {
        if (currentMonthIndex === i) {
          break;
        }
        // Accumulate pixels for future scrolling
        pixelCount = pixelCount + monthBorder + (sizeOfCell * this.monthsArr[i].days.length);
      }
    }
    const scrollable = document.querySelector('.calendar-table__side_inner');

    // Need a scroll for it after rendering
    setTimeout(() => scrollable.scrollLeft = pixelCount, 0);
  }

  /**
   * @description - Get departments to display in select field
   * @memberOf UserListComponent
   */
  getDepartments() {
    this.subscription = this.departmentService.getDepartments().subscribe(
      departments => this.departments = departments,
      error => console.error(error)
    );
  }

  /**
   * @description - Get projects to display in select field
   * @memberOf UserListComponent
   */
  getProjects() {
    this.subscription = this.projectService.getProjects().subscribe(
      projects => this.projects = projects,
      error => console.error(error)
    );
  }

  /**
   * @description - Method for initializing date pickers
   * > After initializing add event listener for change date event
   * @memberOf AnalyticsComponent
   */
  initDatePicker() {
    $('.calendar-controll__filter input[type="text"]').datepicker({
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
      }
    });
    this.setDefaultDates();
  }

  getDaysInThisMonth(date) {
    let now = new Date(date);
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }

  // Set default date picker date to current calendar year
  setDefaultDates() {
    $('input[id="dateFrom"]').datepicker('update', new Date(Date.UTC(new Date().getFullYear(), 0, 1)));
    $('input[id="dateTo"]').datepicker('update', new Date(Date.UTC(new Date().getFullYear(), 11, 1)));
  }

  shareCalendar() {
    this.calendarService.generateShareableLink(this.projectFilter).subscribe(data => {
      this.calendarShareLink = JSON.parse(data['_body']);
      this.isModalOpen = true;
    });
  }

  onModalClose(event) {
    this.isModalOpen = event;
  }
}
