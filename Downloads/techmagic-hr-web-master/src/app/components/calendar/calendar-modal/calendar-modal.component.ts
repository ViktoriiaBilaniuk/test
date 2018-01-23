import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hr-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.sass']
})
export class CalendarModalComponent {
  @Input() isOpen: boolean;
  @Input() shareLink: string;
  @Output() closeModal = new EventEmitter<boolean>();

  close() {
    this.closeModal.emit(false);
  }

  selectText(event) {
    event.target.select();
  }
}
