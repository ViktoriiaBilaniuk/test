import {Http, Response} from '@angular/http';
import {Injectable, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';

import {environment} from './../../environments/environment';
import {USER} from './../models/user';
import {AuthService} from './auth.service';
import {Subject} from 'rxjs/Subject';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class UsersService {
  private user: USER = {};
  public onUserStored: EventEmitter<any> = new EventEmitter();
  public isUserFormChanged = false;
  public isFirstTimeExit = true;
  userFormSubject = new Subject<any>();

  constructor(private http: Http, private auth: AuthService) {
    this.userFormSubject.subscribe(data => {
      this.isFirstTimeExit = true;
      // console.log('data', data);
      this.isUserFormChanged = data.isUserFormChanged;
    });
  }

  getUsers(query, offset) {
    return this.http.get(`${API_ENDPOINT}/users?q=${query.name}&_department=${query.department}` +
      `&project=${query.project}&lastWorkingDay=${query.lwd}&lead=${query.lead}` +
      `&reason=${query.reason}&_room=${query['_room']}&offset=${offset}&limit=10`,
      this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getNewcomers() {
    return this.http.get(`${API_ENDPOINT}/users/newcomers`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getUsersCalendar(project, department, myTeam) {
    return this.http.get(`${API_ENDPOINT}/users?project=${project}&_department=${department}&my-team=${myTeam}`,
      this.auth.generateHttpHeaders())
      .map((leads) => leads.json());
  }

  getAllUsers() {
    return this.http.get(`${API_ENDPOINT}/users`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getUsersByPdp() {
    return this.http.get(`${API_ENDPOINT}/endpoints/pdp`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getLeadsWithEmployees() {
    return this.http.get(`${API_ENDPOINT}/endpoints/leads-with-employees`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getUsersBirthdays() {
    return this.http.get(`${API_ENDPOINT}/endpoints/birthdays`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  createUser(userData) {
    return this.http.post(`${API_ENDPOINT}/users`, userData, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  updateUser(userData, id) {
    return this.http.patch(`${API_ENDPOINT}/users/${id}`, userData, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getUser(id: string) {
    return this.http.get(`${API_ENDPOINT}/users/${id}`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  removeUser(id) {
    return this.http.delete(`${API_ENDPOINT}/users/${id}`, this.auth.generateHttpHeaders())
      .map((response: Response) => response);
  }

  /**
   * @description - Store user to service to make it available for children
   * @param {any} userObj
   * @memberOf UsersService
   */
  storeUser(userObj): void {
    Object.keys(userObj).forEach((key) => {
      this.user[key] = userObj[key];
    });
    this.onUserStored.emit();
  }

  /**
   * @description - Reset user to prevent blinking on user details page
   * @memberOf UsersService
   */
  resetStoredUser(): void {
    this.user = {};
  }

  getStoredUser() {
    return this.user;
  }

  uploadPhoto(formData: FormData, id) {
    return this.http.post(`${API_ENDPOINT}/users/${id}/photo`, formData, this.auth.generateHttpHeaders())
      .map(res => res.json());
  }
}
