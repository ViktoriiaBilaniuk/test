import {Component, Input} from '@angular/core';

@Component({
  selector: 'hr-notes-list-item',
  templateUrl: 'notes-list-item.component.html',
  styleUrls: ['notes-list-item.component.sass']
})
export class NotesListItemComponent {
  @Input() note;
}
