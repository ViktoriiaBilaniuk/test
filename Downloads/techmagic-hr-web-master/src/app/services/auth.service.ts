import { USER } from './../models/user';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { CookieService } from 'ngx-cookie';
import 'rxjs/add/operator/map';

import { ADMIN } from './../models';

import { environment } from './../../environments/environment';

const GOOGLE_AUTH_ENDPOINT = environment.googleAuth;
const API_ENDPOINT = environment.apiEndpoint;
const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('127239b5e54a51aacf7fac2aaff646e4');

@Injectable()
export class AuthService {
  private loggedUserData: USER = {};
  private googleClientId = '438862576290-kmnnpr3vbn3la010alld49epni3ebghj.apps.googleusercontent.com';
  private googleRedirectUri = GOOGLE_AUTH_ENDPOINT;
  private googleResponseType = 'code';
  private googleScope = 'email';

  constructor(private http: Http,
    private router: Router,
    private jwtHelper: JwtHelper,
    private _cookieService: CookieService) { }

  /**
   * @description Method for getting user data from cookies
   * @returns user data from Cookies or make logout
   * @memberOf AuthService
   */
  getUserData() {
    const user = this._cookieService.getObject('user');
    if (user) {
      return user;
    } else {
      return this.logOut();
    }
  }

  /**
   * @description - Generate authorization header with jwt token
   * @returns {RequestOptions}
   * @memberOf AuthService
   */
  generateHttpHeaders(): RequestOptions {
    const headers = new Headers({ 'Authorization': this._cookieService.get('jwt_token') });
    const options = new RequestOptions({ headers: headers });
    return options;
  }

  /**
   * @description - Made request to register new company
   * @param {ADMIN} userData
   * @returns {Observable}
   * @memberOf AuthService
   */
  signUp(userData: ADMIN) {
    return this.http.post(`${API_ENDPOINT}/companies`, userData)
      .map((data: Response) => data.json());
  }


  /**
   * @description Fetch companies list
   * @returns {Observable}
   * @memberOf AuthService
   */
  getCompanies() {
    return this.http.get(`${API_ENDPOINT}/companies`)
      .map((data: Response) => data.json());
  }

  /**
   * @description Check email unicality
   * @param {string} email
   * @returns {Observable}
   * @memberOf AuthService
   */
  checkEmail(email: string) {
    return this.http.post(`${API_ENDPOINT}/auth/checkEmail`, { email })
      .map((data: Response) => data);
  }

  /**
   * @description Check company name unicality
   * @param {string} name
   * @returns {Observable}
   * @memberOf AuthService
   */
  checkCompany(name: string) {
    return this.http.post(`${API_ENDPOINT}/auth/checkCompanyName`, { name })
      .map((data: Response) => data);
  }

  /**
   * @description - Method for user authorization
   * @param {{}} credentials
   * @returns {Observable}
   * @memberOf AuthService
   */
  signIn(credentials: {}) {
    return this.http.post(`${API_ENDPOINT}/auth`, credentials, this.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  /**
   * @description - Method for sign out
   * > Remove user info from localStrorage and cookies
   * > Redirect to login page
   * @returns {boolean}
   * @memberOf AuthService
   */
  logOut() {
    this.clearLoggedUserData();
    localStorage.clear();
    this._cookieService.removeAll();
    this.router.navigate(['login']);
    return false;
  }

  /**
   * @description - Method for checking user authorization and token expirency
   * @returns {boolean}
   * @memberOf AuthService
   */
  checkAuthorization(): boolean {
    // user is logged in, so is allowed to visit route if token is not expired
    if (this._cookieService.get('jwt_token')) {
      return true;
    } else {
      this.logOut();
      this.router.navigate(['login']);
      return false;
    }

  }

  getLoggedUserData() {
    return this.loggedUserData;
  }

  setLoggedUserData(user) {
    let keys = Object.keys(user);
    let length = keys.length;
    for (let i = 0; i < length; i++) {
      this.loggedUserData[keys[i]] = user[keys[i]];
    }
    if (!(this.loggedUserData.role)) {
      this.loggedUserData.role = 0
    }
  }

  clearLoggedUserData() {
    for (let member in this.loggedUserData) {
      if (this.loggedUserData.hasOwnProperty(member)) {
        delete this.loggedUserData[member];
      }
    }
  }

  /**
   * @description - set new loggedUserName val after editing it in own profile
   * @memberOf AuthService
   */
  resetFullName(firstName, lastName) {
    this.loggedUserData.firstName = firstName;
    this.loggedUserData.lastName = lastName;
  }

  /**
  * @description - set new photo after editing it in own profile
  * @memberOf AuthService
  */
  resetPhoto(newPhoto) {
    this.loggedUserData.photo = newPhoto;
  }

  /**
   * @description - Method for storing data to storage after log in
   * @param {any} data
   * @memberOf AuthService
   */
  setAuthDataToStorage(data) {
    console.log(data);
    const user = {
      '_lead': data._lead,
      '_id': data._id,
      'accessToken': data.accessToken,
      'birthday': data.birthday,
      'email': data.email,
      'firstName': data.firstName,
      'gender': data.gender,
      'lastName': data.lastName,
      'phone': data.phone,
      'photo': data.photo,
      'skype': data.skype,
      '_company': data._company,
      'role': data.role || 0
    };
    this._cookieService.put('jwt_token', data.accessToken, { 'expires': this.jwtHelper.getTokenExpirationDate(data.accessToken) });
    this._cookieService.putObject('user', user, { 'expires': this.jwtHelper.getTokenExpirationDate(data.accessToken) });

  }


  /**
   * @description Send request to sending email for reset password`
   * @param {any} userData
   * @returns {Observable}
   * @memberOf AuthService
   */
  sendResetEmail(userData) {
    return this.http.post(`${API_ENDPOINT}/auth/forgot-password`, userData)
      .map(() => 'success');
  }

  /**
   * @description Send request to reset password`
   * @param {any} userData
   * @returns {Observable}
   * @memberOf AuthService
   */
  resetPass(userData) {
    return this.http.patch(`${API_ENDPOINT}/auth/reset-password`, userData)
      .map(() => 'success');
  }

  checkResetPassToken(token) {
    return this.http.get(`${API_ENDPOINT}/auth/check-pwd-reset?pwdToken=` + token)
      .map(() => 'success');
  }

  googleAuth() {
    window.open(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.googleClientId}&redirect_uri=${this.googleRedirectUri}&response_type=${this.googleResponseType}&scope=${this.googleScope}`, '_self');
  }

  addUserMixpanel(user) {
    if (user) {
      mixpanel.people.set(user._id, {
        distinct_id: user._id,
        username: user.firstName + ' ' + user.lastName,
        $os: navigator.platform,
        $browser: navigator.userAgent,
        Company: user._company.name,
        $token: user.accessToken,
        $first_name: user.firstName,
        $last_name: user.lastName,
        $email: user.email,
        $created: new Date(),
        'platform': 'web',
        $phone: user.phone
      });
    } else {
      mixpanel.people.set('Anonymous', {});
    }
  }
}
