import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';

import {DepartmentsService} from './../../../services';

@Component({
  selector: 'hr-departments-form',
  templateUrl: './departments-form.component.html',
  styleUrls: ['departments-form.component.sass']
})
export class DepartmentsFormComponent implements OnInit, OnDestroy {
  departmentId: string;
  department: any = {};
  private subscription: Subscription;

  constructor(private departmentsService: DepartmentsService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.departmentId = param['id'];
        if (this.departmentId) {
          this.getDepartmentInfo();
        }
      },
      error => console.error('Error: ', error)
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * @description - Get department info for editing it
   * @memberOf AddRoomComponent
   */
  getDepartmentInfo(): void {
    this.departmentsService.getDepartment(this.departmentId).subscribe(
      (department) => {
        this.department = department;
      },
      error => console.error('Error: ', error)
    );
  }

  /**
   * @description - Handle form submit
   * @param {any} DepartmentForm
   * @memberOf DepartmentsFormComponent
   */
  onSubmit(DepartmentForm): void {
    if (DepartmentForm.valid) {
      if (this.departmentId) {
        this.updateDepartment(DepartmentForm.value);
      } else {
        this.createDepartment(DepartmentForm.value);
      }
    }
  }

  updateDepartment(DepartmentFormValue) {
    this.subscription = this.departmentsService.updateDepartment(DepartmentFormValue, this.departmentId).subscribe(
      () => this.router.navigate(['departments/list']),
      error => console.error('Error: ', error)
    );
  }

  createDepartment(DepartmentFormValue) {
    this.subscription = this.departmentsService.createDepartment(DepartmentFormValue).subscribe(
      () => this.router.navigate(['departments/list']),
      error => console.error('Error: ', error)
    );
  }

  goToList(): void {
    this.router.navigate(['departments/list']);
  }

  deleteDepartment() {
    this.subscription = this.departmentsService.deleteDepartment(this.departmentId).subscribe(
      () => this.router.navigate(['departments/list']),
      error => console.error('Error: ', error)
    );
  }
}
