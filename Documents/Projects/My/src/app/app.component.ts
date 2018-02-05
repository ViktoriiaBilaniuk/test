import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';

  navTabs = [
    {'name': 'In Needs'},
    {'name': 'In Offers'}
  ];

  selectedItem = this.navTabs[0];

  constructor() { }

  activateLink(event, newValue) {
    console.log(newValue);
    this.selectedItem = newValue;
  }

}
