import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import {AuthService} from './auth.service';
import {environment} from './../../environments/environment';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class TimeOffService {

  constructor(private http: Http, private auth: AuthService) {}

  getDates(id) {
    return this.http.get(`${API_ENDPOINT}/time-off/dates/${id}`, this.auth.generateHttpHeaders())
      .map((res) => res.json());
  }

  getTotalDays(type, uid, param) {
    return this.http.get(`${API_ENDPOINT}/time-off/${type}/user/${uid}/totaldays?${param}`, this.auth.generateHttpHeaders())
      .map((res) => res.json());
  }

  getCalculateDays(uid, param) {
    return this.http.get(`${API_ENDPOINT}/time-off/calculate/${uid}/?${param}`, this.auth.generateHttpHeaders())
      .map((res) => res.json());
  }

  getNotAvailableDays(uid, param) {
    return this.http.get(`${API_ENDPOINT}/time-off/calendar/user/${uid}?${param}`, this.auth.generateHttpHeaders())
      .map((res) => res.json());
  }

  getRequestedItems(param, type) {
    return this.http.get(`${API_ENDPOINT}/time-off/${type}?${param}`, this.auth.generateHttpHeaders())
      .map((res) => {
        return res.json().map(val => {
          val.displayFrom = moment.utc(val.dateFrom).format('MMM DD, YYYY');
          val.displayTo = moment.utc(val.dateTo).format('MMM DD, YYYY');
          return val;
        });
      });
  }

  getRequestedItemsForUser(uid, param, type) {
    return this.http.get(`${API_ENDPOINT}/time-off/${type}/user/${uid}?${param}`, this.auth.generateHttpHeaders())
      .map((res) => {
        return res.json().map(val => {
          val.displayFrom = moment.utc(val.dateFrom).format('MMM DD, YYYY');
          val.displayTo = moment.utc(val.dateTo).format('MMM DD, YYYY');
          return val;
        });
      });
  }

  removeItem(type, id) {
    return this.http.delete(`${API_ENDPOINT}/time-off/${type}/${id}`, this.auth.generateHttpHeaders())
    .map((res) => null);
  }

  createItem(type, vacation) {
    return this.http.post(`${API_ENDPOINT}/time-off/${type}`, vacation, this.auth.generateHttpHeaders())
    .map((res) => null);
  }

  confirmItem(type, id, isAccepted, reason?) {
    return this.http.put(`${API_ENDPOINT}/time-off/${type}/${id}`, {isAccepted: isAccepted, reason: reason}, this.auth.generateHttpHeaders())
    .map((res) => null);
  }

  // TODO переписати коли буде route на backend
  getMonthsWithHolidays(dates) {
    return this.http.get(`${API_ENDPOINT}/endpoints/calendar?dateFrom=${dates.dateFrom}&dateTo=${dates.dateTo}`,
      this.auth.generateHttpHeaders())
      .map((holidays) => holidays.json());
  }
}
