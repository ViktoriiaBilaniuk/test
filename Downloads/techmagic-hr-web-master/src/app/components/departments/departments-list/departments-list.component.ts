import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {DEPARTMENT} from './../../../models';
import {DepartmentsService, SpinnerService} from './../../../services';

@Component({
  selector: 'hr-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['departments-list.component.sass']
})
export class DepartmentsListComponent implements OnInit, OnDestroy {
  departments: DEPARTMENT[];
  private subscription: Subscription;

  constructor(private departmentsService: DepartmentsService,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.getDepartments();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.spinnerService.hideSpinner();
  }

  getDepartments() {
    this.subscription = this.departmentsService.getDepartments().subscribe(
      (res) => {
        this.departments = res;
        this.spinnerService.hideSpinner();
      },
      (error) => {
        console.error('Error: ', error);
        this.spinnerService.hideSpinner();
      }
    );
  }
}
