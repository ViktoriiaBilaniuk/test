import {Router} from '@angular/router';
import {Component, Input} from '@angular/core';

import {PROJECT} from './../../../models';

@Component({
  selector: 'hr-projects-list-item',
  templateUrl: 'projects-list-item.component.html',
  styleUrls: ['projects-list-item.component.sass']
})
export class ProjectListItemComponent {
  @Input() project: PROJECT;

  constructor(private router: Router) {}

  goToEdit() {
    this.router.navigate(['/projects/edit', this.project._id]);
  }

}
