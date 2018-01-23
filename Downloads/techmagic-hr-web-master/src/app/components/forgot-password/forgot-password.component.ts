import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {AuthService} from './../../services';
import {COMPANY} from './../../models';

@Component({
  selector: 'hr-forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['../login/login.component.sass']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  companies: COMPANY[];
  selectedCompany: string;
  validationError: string;
  showSuccessMessage = false;
  private subscription: Subscription;

  constructor(private auth: AuthService) {
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

  onSubmit(forgotPassForm) {
    if (forgotPassForm.valid) {
      this.subscription = this.auth.sendResetEmail(forgotPassForm.value)
        .subscribe(
          data => this.showSuccessMessage = true,
          error => {
            this.validationError = 'Wrong company or email';
            console.error('Error: ', error);
          }
        );
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
        if (window.location.hostname === 'hr.techmagic.co') {
          this.selectedCompany = companies.find(company => company['name'] === 'TechMagic')._id;
        }
      },
      (error) => console.error('Error: ', error)
    );
  }
}
