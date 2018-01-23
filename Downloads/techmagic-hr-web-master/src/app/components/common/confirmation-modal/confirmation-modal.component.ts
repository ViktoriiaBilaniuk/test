import { Component, Input, Output, EventEmitter, OnDestroy, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'hr-confirmation-modal',
  templateUrl: 'confirmation-modal.component.html',
  styleUrls: ['confirmation-modal.component.sass']
})
export class ConfirmationModalComponent implements OnDestroy, AfterViewChecked {
  @Input() target;
  @Input() custom_id;
  @Output() confirm = new EventEmitter();

  onConfirm() {
    this.confirm.emit();
  }

  ngAfterViewChecked() {
    // Set custom data-target attribute to call modal
    $(`#${this.custom_id}`).prev().attr('data-target', `#${this.custom_id}`);
  }

  ngOnDestroy() {
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
  }
}
