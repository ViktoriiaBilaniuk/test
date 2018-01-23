import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ReasonsService, SpinnerService} from './../../../services';
import {REASON} from './../../../models';

@Component({
  selector: 'hr-reasons-list',
  templateUrl: 'reasons-list.component.html',
  styleUrls: ['reasons-list.component.sass']
})
export class ReasonListComponent implements OnInit, OnDestroy {
  reasons: REASON[];
  private subscription: Subscription;

  constructor(private reasonService: ReasonsService,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.getReasons();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.spinnerService.hideSpinner();
  }

  getReasons() {
    this.subscription = this.reasonService.getReasons().subscribe(
      (res) => {
        this.reasons = res;
        this.spinnerService.hideSpinner();
      },
      (error) => {
        console.error('Error: ', error);
        this.spinnerService.hideSpinner();
      }
    );
  }

}
