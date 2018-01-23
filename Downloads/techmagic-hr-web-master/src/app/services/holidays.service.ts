import {Http} from '@angular/http';
import {Injectable} from '@angular/core';

import {environment} from './../../environments/environment';
import {AuthService} from './auth.service';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class HolidaysService {

  constructor(private http: Http, private auth: AuthService) {}

  getLeads() {
    return this.http.get(`${API_ENDPOINT}/endpoints/leads`, this.auth.generateHttpHeaders())
      .map((leads) => leads.json());
  }

  getHolidaysYears() {
    return this.http.get(`${API_ENDPOINT}/endpoints/holiday-years`, this.auth.generateHttpHeaders())
      .map((years) => years.json());
  }

  getHolidays(year) {
    return this.http.get(`${API_ENDPOINT}/holidays?year=${year}`, this.auth.generateHttpHeaders())
      .map((holidays) => holidays.json());
  }

  getAllHolidays() {
    return this.http.get(`${API_ENDPOINT}/holidays`, this.auth.generateHttpHeaders())
      .map((holidays) => holidays.json());
  }

  getHoliday(id) {
    return this.http.get(`${API_ENDPOINT}/holidays/${id}`, this.auth.generateHttpHeaders())
      .map((holiday) => holiday.json());
  }

  addHoliday(holidayData) {
    return this.http.post(`${API_ENDPOINT}/holidays`, holidayData, this.auth.generateHttpHeaders())
      .map((years) => years.json());
  }

  updateHoliday(updatedHoliday) {
    return this.http.patch(`${API_ENDPOINT}/holidays/${updatedHoliday._id}`, updatedHoliday, this.auth.generateHttpHeaders())
      .map((holiday) => holiday.json());
  }

  deleteHoliday(id) {
    return this.http.delete(`${API_ENDPOINT}/holidays/${id}`, this.auth.generateHttpHeaders())
      .map(() => 'success');
  }
}
