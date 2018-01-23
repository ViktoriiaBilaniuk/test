import {Router} from '@angular/router';
import {Component, Input} from '@angular/core';

import {ROOM} from './../../../models';

@Component({
  selector: 'hr-room-list-item',
  templateUrl: 'room-list-item.component.html',
  styleUrls: ['room-list-item.component.sass']
})
export class RoomListItemComponent {
  @Input() room: ROOM;

  constructor(private router: Router) {}

  goToEdit() {
    this.router.navigate(['/rooms/edit', this.room._id]);
  }
}
