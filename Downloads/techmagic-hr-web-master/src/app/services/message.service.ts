import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { messageMap } from './message.map';

@Injectable()
export class MessageService {
  subject = new Subject<any>();

  constructor() { }

  openModal(params: {paramsString?: string, customMessage?: string, customType?: string}) {
    let paramsArray = params.paramsString ? params.paramsString.split('_') : [];
    let page;
    let modalType;
    let messagePosition;
    let message;

    if (params.customMessage && params.customType) {
        message = params.customMessage;
        modalType = params.customType;
    } else if (paramsArray.length) {
        page = paramsArray[0];
        modalType = paramsArray[1];
        messagePosition = paramsArray[2];
        message = messageMap[page][modalType][messagePosition];
    } else {
      message = 'Something went wrong';
      modalType = 'warning';
    }

    //                         page_modalType_messagePosition: STRING
    //                                          ↓
    // this.messageService.openModal('googleLogin_danger_0');
    this.subject.next({
      isOpen: true,
      modalType: modalType,
      message: message
    });
  }

  closeModal() {
    this.subject.next();
  }
}
