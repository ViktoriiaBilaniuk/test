import {Component, OnInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {environment} from '../environments/environment';
import {CookieService} from 'ngx-cookie';
declare const ga: Function;
const Mixpanel = require('mixpanel');
const mixpanel = Mixpanel.init('127239b5e54a51aacf7fac2aaff646e4');

@Component({
  selector: 'hr-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.sass']
})
export class AppComponent implements OnInit {
  private user;

  constructor(private router: Router,
              private _cookieService: CookieService) {
    this.routerEvents();
  }

  ngOnInit() {
    this.user = this.getUserCookie('user');
    console.log('%c Version: 1.4.0', 'color: #007675; font-weight: bold;');
  }

  setMixPanel(val) {
    if (this.user && this.user._id) {
      mixpanel.track(val.url, {
        'distinct_id': this.user._id,
      });
      mixpanel.people.set(this.user._id, {
        $last_seen: new Date(),
        'platform': 'web',
      });
    }
  }

  routerEvents() {

    this.router.events.subscribe((val) => {
      if (environment.production) {
        // get user
        this.user = this.getUserCookie('user');

        if (val instanceof NavigationEnd) {
          this.setMixPanel(val);
          ga('set', 'page', val.urlAfterRedirects);
          ga('send', 'pageview');
          if (this.user && this.user._id) {
            ga('set', 'userId', this.user._id);
          }
        }
      }
    });
  }

  getUserCookie(key: string) {
    return this._cookieService.getObject(key);
  }


}
