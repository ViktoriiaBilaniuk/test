import { Component } from '@angular/core';

@Component({
  selector: 'hr-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['footer.component.sass']
})
export class FooterComponent {
  date;

  constructor() {
    this.date = new Date().getFullYear();
  }
}
