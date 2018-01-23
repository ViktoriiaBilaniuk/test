import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as moment from 'moment';

import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class CalendarService {

  constructor(private auth: AuthService,
              private http: Http) { }

  // Generate calendar
  generateCalenderBody(users, monthsArr) {
    const body = document.getElementById('calendar-body');
    const rows = document.createDocumentFragment();

    for (let i = 0; i < users.length; i++) {
      const row = this.generateTableRow(users[i], monthsArr);
      rows.appendChild(row);
    }

    body.appendChild(rows);
    return body;
  }

  // Generate individual user row
  generateTableRow(user, monthsArr) {
    const tr = document.createElement('tr');

    for (let i = 0; i < monthsArr.length; i++) {
      const td = this.generateMonthTableCell(monthsArr[i], user);
      tr.appendChild(td);
    }
    return tr;
  }

  // For each user generate large wrapper cell for each month
  generateMonthTableCell(month, user) {
    const td = document.createElement('td');
    const innerMonth = this.createInnerMonthTable(month, user);
    td.appendChild(innerMonth);
    return td;
  }

  // generate table for each month in user row
  createInnerMonthTable(month, user) {
    const singleMonthTable = document.createElement('table');
    singleMonthTable.setAttribute('cellpadding', '0');
    singleMonthTable.setAttribute('cellspacing', '0');
    singleMonthTable.setAttribute('border', '0');
    const row = document.createElement('tr');

    const monthNumber = +moment().month(month.name).format('M');
    for (let i = 1; i <= month.days.length; i++) {
      const td = this.createSingleDayCell(month, monthNumber, i, user);
      row.appendChild(td);
    }
    singleMonthTable.appendChild(row);
    return singleMonthTable;
  }

  // method for creating single day cell
  createSingleDayCell(month, monthNumber, day, user) {
    let td = document.createElement('td');
    td.className += 'cell';
    td = this.hasAccentTransformer(td, month, monthNumber, day, user);
    return td;
  }

  // Check if cell should been highlighted
  hasAccentTransformer(td, month, monthNumber, day, user) {
    const dayOfWeek = new Date(`20${month.year}-${monthNumber}-${day}`).getDay();
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      td.classList.add('cell_weekend');
    }

    if (month.holidays.length) {
      for (const item of month.holidays) {
        if (item.date === day) {
          td.classList.add('cell_holiday');
          td.setAttribute('data-balloon-pos', 'right');
          td.setAttribute('data-balloon', item.name);
        }
      }
    }

    td = this.cellTransform(td, month, monthNumber, day, user);
    return td;
  }

  // Check which event take place in day, and call method for settings attributes
  cellTransform(td, month, monthNumber, day, user) {
    const isVacation = this.checkIfTimeOff('_vacations', month, monthNumber, day, user);
    if (isVacation) {
      this.setCellAttributes(td, isVacation, 'vacation');
    }

    const isDayOff = this.checkIfTimeOff('_dayoff', month, monthNumber, day, user);
    if (isDayOff && !td.classList.contains('cell_vacation')) {
      this.setCellAttributes(td, isDayOff, 'day-off');
    }

    const isIllness = this.checkIfTimeOff('_illness', month, monthNumber, day, user);
    if (isIllness && !td.classList.contains('cell_vacation') && !td.classList.contains('cell_day-off')) {
      this.setCellAttributes(td, isIllness, 'illness');
    }

    const isBusinessTrip = this.checkIfTimeOff('_businessTrip', month, monthNumber, day, user);
    if (isBusinessTrip && !td.classList.contains('cell_vacation') && !td.classList.contains('cell_business-trip')) {
      this.setCellAttributes(td, isBusinessTrip, 'business-trip');
    }
    return td;
  }

  // Check if there is any timeoff in day
  checkIfTimeOff(eventType, month, monthNumber, day, user) {
    return user[eventType].find(item => {
      if (new Date(item.dateFrom).getMonth() === (monthNumber - 1) ||
        new Date(item.dateTo).getMonth() === (monthNumber - 1)) {
        return this.getDaysArr(item.dateFrom, item.dateTo).find((dayItem) => {
          return +dayItem.day === +day && +dayItem.year === +month.year && (+dayItem.month === +monthNumber);
        });
      }
    });
  }

   // Set cell attributes according to day event
  setCellAttributes(td, dayTimeOff, timeOffString) {
    td.setAttribute('data-user-id', dayTimeOff._user);
    td.setAttribute('data-id', dayTimeOff._id);
    if (dayTimeOff.isAccepted) {
      td.classList.add(`cell_${timeOffString}`);
    } else if (dayTimeOff.isAccepted === false) {
      td.classList.remove(`cell_${timeOffString}`);
    } else {
      td.classList.add(`cell_${timeOffString}`);
      td.classList.add('cell_requested');
      td.setAttribute('data-balloon-pos', 'right');
      td.setAttribute('data-balloon', `requested ${timeOffString.replace('-', ' ')}`);
    }
  }

  // Generate day array between two days
  getDaysArr(dateStart, dateEnd) {
    const days = [];
    const startD = moment(dateStart);
    const endD = moment(dateEnd);

    while (endD >= startD) {
      days.push({
        day: startD.date(),
        month: startD.format('M'),
        year: startD.format('YY')
      });
      startD.add(1, 'day');
    }
    return days;
  }

  generateShareableLink(projectID) {
    return this.http.get(`${API_ENDPOINT}/share-calendar/generate?projectId=${projectID}`, this.auth.generateHttpHeaders());
  }
}
