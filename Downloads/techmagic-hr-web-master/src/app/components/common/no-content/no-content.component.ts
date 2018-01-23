import {Component} from '@angular/core';

@Component({
  selector: 'hr-no-content',
  template: `
    <div style="text-align: center; width: 60%; margin: 20% auto auto auto; padding-bottom: 10%" class="panel panel-info">
      <div class="panel-heading">
        <h1>404</h1>
      </div>
      <div class="panel-body">
        <h2>Page not found</h2>
      </div>
      <div>
        <a [routerLink]="['/']" class="btn btn-info">Go to Home Page</a>
      </div>
    </div>
  `
})
export class NoContentComponent {}
