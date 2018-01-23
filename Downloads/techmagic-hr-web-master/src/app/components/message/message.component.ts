import { Component, OnDestroy, OnInit } from '@angular/core';

import { MessageService } from '../../services/message.service';

@Component({
  selector: 'hr-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.sass']
})
export class MessageComponent implements OnInit, OnDestroy {
  isOpen = false;
  type = 'success';
  modalTimeout = 10000;
  message = '';

  constructor(private messageService: MessageService) {
    this.messageService.subject.subscribe(data => {
      if (data.isOpen) {
        this.isOpen = data.isOpen;
        this.message = data.message;
        this.type = data.modalType;

        setTimeout(() => {
          this.isOpen = false;
        }, this.modalTimeout);
      } else {
        this.isOpen = false;
      }
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.messageService.subject.unsubscribe();
  }

  isSuccess() {
    return this.type === 'success';
  }

  isInfo() {
    return this.type === 'info';

  }

  isWarning() {
    return this.type === 'warning';

  }

  isDanger() {
    return this.type === 'danger';

  }

  closeModal() {
    this.isOpen = false;
  }
}
