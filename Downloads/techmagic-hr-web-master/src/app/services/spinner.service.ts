import {Injectable} from '@angular/core';

@Injectable()
export class SpinnerService {
  showSpinner() {
    document.getElementById('loading-spinner').classList.remove('spinner-hidden');
  }

  hideSpinner() {
    document.getElementById('loading-spinner').classList.add('spinner-hidden');
  }
}
