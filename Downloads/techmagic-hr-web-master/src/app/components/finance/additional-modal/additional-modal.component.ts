import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';

@Component({
  selector: 'hr-additional-modal',
  templateUrl: './additional-modal.component.html',
  styleUrls: ['./additional-modal.component.sass']
})
export class AdditionalModalComponent implements OnChanges {
  @Input() info;
  @Input() show: boolean;
  @Output() closed =  new EventEmitter();

  constructor() { }

  ngOnChanges() {

  }

  close() {
    this.closed.emit();
    this.show = false;
  }

}
