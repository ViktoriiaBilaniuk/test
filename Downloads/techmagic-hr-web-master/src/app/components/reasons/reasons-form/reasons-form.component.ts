import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ReasonsService} from './../../../services';

@Component({
  selector: 'hr-reasons-form',
  templateUrl: 'reasons-form.component.html',
  styleUrls: ['reasons-form.component.sass']
})
export class ReasonFormComponent implements OnInit, OnDestroy {
  reasonId: string;
  reason: any = {};
  private subscription: Subscription;

  constructor(private reasonsService: ReasonsService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.reasonId = param['id'];
        if (this.reasonId) {
          this.reason = this.reasonsService.getStoredReason();
          this.getReasonInfo();
        }
      },
      error => console.error('Error: ', error)
    );
  }

  /**
   * @description - Handle form submit
   * @param {any} addReasonForm
   * @memberOf ReasonFormComponent
   */
  onSubmit(addReasonForm): void {
    if (addReasonForm.valid) {
      const formatedReasonDate = this.formatReasonData(addReasonForm.value);
      if (this.reasonId) {
        this.subscription = this.reasonsService.updateReason(formatedReasonDate, this.reasonId).subscribe(
          () => this.router.navigate(['/reasons/list']),
          error => console.error('Error: ', error)
        );
      } else {
        this.subscription = this.reasonsService.createReason(formatedReasonDate).subscribe(
          () => this.router.navigate(['reasons/list']),
          error => console.error('Error: ', error)
        );
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * @description - Get reason info for editing it
   * @memberOf ReasonFormComponent
   */
  getReasonInfo(): void {
    this.reasonsService.getReason(this.reasonId).subscribe(
      (reason) => {
        this.reasonsService.storeReason(reason);
      },
      error => console.error('Error: ', error)
    );
  }

  goToList(): void {
    this.router.navigate(['reasons/list']);
  }

  /**
   * @description Format reason data before sending to server
   * > Format time to timestamp
   * > convert role field to number
   * @param {any} reasonObj
   * @returns {any} reasonObj
   * @memberOf reasonFormComponent
   */
  formatReasonData(reasonObj): {} {
    return reasonObj;
  }

  deleteReason() {
    this.subscription = this.reasonsService.deleteReason(this.reasonId).subscribe(
      () => this.router.navigate(['reasons/list']),
      (error) => console.error('Error: ', error)
    );
  }

}
