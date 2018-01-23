import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { environment } from '../../environments/environment';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class SharedCalendarService {

  constructor(private http: Http) { }

  getCalendar(token: string, dateStart: number, dateEnd) {
    return this.http.get(`${API_ENDPOINT}/share-calendar?token=${token}&dateStart=${dateStart}&dateEnd=${dateEnd}`)
      .map((data: Response) => data.json())
      .map((data) => {
        data.calendar = this.updateCalendarDays(data.calendar);
        data.users = this.updateUser(data.users);

        return data;
      });
  }

  updateCalendarDays(calendar) {
    const result = JSON.parse(JSON.stringify(calendar));

    for (let month = 0; month < calendar.length; month++) {
      for (let day = 0; day < calendar[month].days.length; day++) {
        result[month].days[day] = new Date(calendar[month].days[day]);
      }
    }

    return result;
  }

  updateUser(users) {
    const result = JSON.parse(JSON.stringify(users));

    result.map((user) => {
      user.vacations = this.arrayToDate(user.vacations);
      user.dayOffs = this.arrayToDate(user.dayOffs);
      user.illnesses = this.arrayToDate(user.illnesses);
    });

    return result;
  }

  arrayToDate (array) {
    const result = [];

    for (let index = 0; index < array.length; index++) {
      result.push(new Date(array[index]));
    }

    return result;
  }


  isHoliday(currentDay, months) {
    const currentDayDate = new Date(currentDay);

    for (let day = 0; day < months.holidays.length; day++) {
      if (months.holidays[day].date === currentDayDate.getDate()) {
        return true;
      }
    }

    return false;
  }

  isDayoff(curDate, user, type) {
    const typesMap = {
      'day-off': 'dayOffs',
      'illness': 'illnesses',
      'vacation': 'vacations'
    };

    return user[typesMap[type]] ? user[typesMap[type]].some(el => this.areDatesSame(el, curDate)) : false;
  }

  areDatesSame(firstDate, secondDate) {
    return firstDate.getFullYear() === secondDate.getFullYear() &&
           firstDate.getDate() === secondDate.getDate() &&
           firstDate.getMonth() === secondDate.getMonth();
  }
}
