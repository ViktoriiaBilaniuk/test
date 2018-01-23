import {Router} from '@angular/router';
import {Component, OnInit, Input} from '@angular/core';
import {REASON} from './../../../models';

@Component({
  selector: 'hr-reasons-list-item',
  templateUrl: 'reasons-list-item.component.html',
  styleUrls: ['reasons-list-item.component.sass']
})
export class ReasonListItemComponent implements OnInit {
  @Input() reason: REASON;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  goToEdit() {
    this.router.navigate(['/reasons/edit', this.reason._id]);
  }

}
