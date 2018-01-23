import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnDestroy, OnInit} from '@angular/core';

import {AuthService} from './../../services';

@Component({
  selector: 'hr-reset-password',
  templateUrl: 'reset-password.component.html',
  styleUrls: ['../login/login.component.sass']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  validationError: string;
  showSuccessMessage: boolean;
  private pwdToken;
  private subscription: Subscription;
  isActiveToken: boolean;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private auth: AuthService) {}

  ngOnInit() {
    this.isActiveToken = true;
    this.activatedRoute.queryParams.subscribe(
      (params: any) => this.pwdToken = params['jwt'] || '',
      error => console.error('Error')
    );
    this.subscription = this.auth.checkResetPassToken(this.pwdToken)
      .subscribe(
        data => this.isActiveToken = true,
        error => {
          this.isActiveToken = false;
          this.validationError = 'Your reset link was already used. Please, generate a new one.';
          console.error('Error: ', error);
        }
      );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit(resetPassForm) {
    if (resetPassForm.valid && resetPassForm.value.password1 === resetPassForm.value.password2) {
      this.subscription = this.auth.resetPass({password: resetPassForm.value.password1, pwdToken: this.pwdToken})
        .subscribe(
          data => this.router.navigate(['login']),
          error => {
            this.validationError = 'Your reset link was already used. Please, generate a new one.';
            console.error('Error: ', error);
          }
        );
    }
  }
}
