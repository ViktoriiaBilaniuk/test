import {Component} from '@angular/core';

import {AuthService} from '../../../services/auth.service';


@Component({
  selector: 'hr-google-btn',
  template: '<button class="loginBtn loginBtn--google" (click)="googleLogin()">Google Sign-In</button>',
  styleUrls: ['./google-btn.component.sass']
})
export class GoogleBtnComponent {
  constructor(private auth: AuthService) { }

  googleLogin() {
    this.auth.googleAuth();
  }
}
