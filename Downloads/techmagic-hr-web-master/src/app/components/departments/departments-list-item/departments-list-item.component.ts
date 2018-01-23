import {Router} from '@angular/router';
import {Component, Input} from '@angular/core';

import {DEPARTMENT} from './../../../models/department';

@Component({
  selector: 'hr-departments-list-item',
  templateUrl: './departments-list-item.component.html',
  styleUrls: ['departments-list-item.component.sass']
})
export class DepartmentsListItemComponent {
  @Input() department: DEPARTMENT;

  constructor(private router: Router) {}

  goToEdit() {
    this.router.navigate(['departments/edit', this.department._id]);
  }

}
