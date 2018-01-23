import { Injectable } from '@angular/core';

@Injectable()
export class HelpersService {

  constructor() { }

  objectEquals(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (Object.keys(a).length !== Object.keys(b).length) return false;

    return Object.keys(a).every(function(key) {
      return a[key] === b[key];
    });
  }

  deleteAllCookies() {
    let cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      let eqPos = cookie.indexOf('=');
      let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
}
