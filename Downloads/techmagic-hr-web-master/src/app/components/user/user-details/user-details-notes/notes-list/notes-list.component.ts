import {Component} from '@angular/core';

import {UsersService} from './../../../../../services';

@Component({
  selector: 'hr-notes-list',
  templateUrl: 'notes-list.component.html',
  styleUrls: ['notes-list.component.sass']
})
export class NotesListComponent {
  user = this.usersService.getStoredUser();

  constructor(private usersService: UsersService) {}
}
