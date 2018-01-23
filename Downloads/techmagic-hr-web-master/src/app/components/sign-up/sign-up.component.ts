import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

import {AuthService} from './../../services';

@Component({
  selector: 'hr-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../login/login.component.sass', 'sing-up.component.sass']
})
export class SignUpComponent implements OnInit {
  notUniqueEmail: boolean;
  notUniqueCompany: boolean;
  formIsSubmited: boolean;
  firstNameInvalid = false;
  lastNameInvalid = false;
  private firstNamePattern = /^([a-zA-Z]+[\s-]?)*[a-zA-Z]+$/g;
  private lastNamePattern = /^([a-zA-Z]+(-)?)*[a-zA-Z]+$/g;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    this.addEmailCheckListeners();
    this.addCompanyCheckListeners();
  }

  /**
   * @description - handle form submission
   * @param {any} signUpForm
   * @memberOf SignUpComponent
   */
  onSubmit(signUpForm): void {
    if (signUpForm.valid && !this.notUniqueEmail) {
      if (this.checkNames(signUpForm.value)) {
        this.auth.signUp(signUpForm.value)
          .subscribe(
            data => {
              this.auth.setAuthDataToStorage(data);
              this.auth.setLoggedUserData(data);
              this.router.navigate(['employees', 'list']);
            },
            error => console.error('Error: ', error)
          );
      } else {
        this.markSubmitted();
      }
    } else {
      this.markSubmitted();
    }
  }

  markSubmitted() {
    this.formIsSubmited = true;
    $('#signUpForm').addClass('submited');
  }

  checkNames(formData) {
    const validFN = formData.firstName.match(this.firstNamePattern);
    const validLN = formData.lastName.match(this.lastNamePattern);
    if (validFN && validLN) {
      return true;
    } else {
      this.firstNameInvalid = !validFN;
      this.lastNameInvalid = !validLN;
    }
  }

  checkEmail(email) {
    this.auth.checkEmail(email).subscribe(
      response => null,
      error => {
        if (error.status === 409) {
          $('#userEmail').addClass('invalid');
          this.notUniqueEmail = true;
        }
        console.error('Error: ', error);
      }
    );
  }

  checkCompanyName(company) {
    this.auth.checkCompany(company).subscribe(
      response => null,
      error => {
        if (error.status === 409) {
          $('#companyName').addClass('invalid');
          this.notUniqueCompany = true;
        }
        console.error('Error: ', error);
      }
    );
  }

  resetEmailChecker() {
    this.notUniqueEmail = false;
    $('#userEmail').removeClass('invalid');
  }

  resetCompanyChecker() {
    this.notUniqueCompany = false;
    $('#companyName').removeClass('invalid');
  }

  addEmailCheckListeners() {
    $('#userEmail').blur((event) => {
      if ($(event.target).hasClass('ng-valid')) {
        this.checkEmail($(event.target).val());
      }
    })
      .focusin(() => {
        this.resetEmailChecker();
      });
  }

  addCompanyCheckListeners() {
    $('#companyName').blur((event) => {
      if ($(event.target).hasClass('ng-valid')) {
        this.checkCompanyName($(event.target).val());
      }
    })
      .focusin(() => {
        this.resetCompanyChecker();
      });
  }
}
