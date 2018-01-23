import {Component, Input} from '@angular/core';

import {HOLIDAY} from '../../../models/holiday';

@Component({
  selector: 'hr-holidays-list-item',
  templateUrl: 'holidays-list-item.component.html'
})
export class HolidaysListItemComponent {
  @Input() holiday: HOLIDAY;
}
