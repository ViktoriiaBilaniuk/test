import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CookieService } from 'ngx-cookie';

import { AuthService } from './../../services';
import { COMPANY } from './../../models';
import { MessageService } from '../../services/message.service';

const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('127239b5e54a51aacf7fac2aaff646e4');

@Component({
  selector: 'hr-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.sass']
})
export class LoginComponent implements OnInit, OnDestroy {
  validationError: string;
  companies: COMPANY[];
  selectedCompany: string;
  private user;
  private subscription: Subscription;


  constructor(private router: Router,
              private auth: AuthService,
              private _cookieService: CookieService) {
    this.selectedCompany = '';
  }

  ngOnInit() {
    this.getCompaniesList();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * @description - Get companies list for log in
   * > Set TechMagic company for host 'hr.techmagic.co'
   * @memberOf LoginComponent
   */
  getCompaniesList(): void {
    this.auth.getCompanies().subscribe(
      (companies: COMPANY[]) => {
        this.companies = companies;
        this.companies.unshift({_id: '', name: 'Select your Company'});
        this.preselectCompany();
      },
      error => console.error('Error: ', error)
    );
  }

  preselectCompany() {
    if (this.isUrl('hr.techmagic.co')) {
      this.selectedCompany = this.companies.find(company => company['name'] === 'TechMagic')._id;
    } else if (localStorage.getItem('selectedCompany')) {
      this.selectedCompany = localStorage.getItem('selectedCompany');
    }else {
      this.selectedCompany = this.companies[0]._id;
    }
  }

  /**
   * @description - Submit login form and call auth service to post credentials
   * @param {{}} user
   * @memberOf LoginComponent
   */
  onSubmit(loginForm) {
    if (loginForm.valid) {
      this.subscription = this.auth.signIn(loginForm.value)
        .subscribe(
          data => {
            this.auth.setAuthDataToStorage(data);
            this.auth.setLoggedUserData(data);
            this.getUserCookie('user');
            this.addUserMixpanel();
            this.router.navigate(['employees', 'list']);
            localStorage.setItem('selectedCompany', loginForm.value._company);
          },
          error => this.validationError = 'Wrong password or email'
        );
    }
  }

  addUserMixpanel() {
    this.auth.addUserMixpanel(this.user);
  }

  getUserCookie(key: string) {
    // this.auth.getUserCookie(key, this.user)
    this.user = this._cookieService.getObject(key);
  }

  isUrl(path) {
    if (window.location.hostname === path) {
      return true;
    }
  }
}
