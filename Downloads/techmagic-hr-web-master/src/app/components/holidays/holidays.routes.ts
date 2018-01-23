import {Routes} from '@angular/router';

import {HolidaysListComponent} from './holidays-list/holidays-list.component';
import {HolidaysFormComponent} from './holidays-form/holidays-form.component';

export const HOLIDAYS_ROUTES: Routes = [
  {path: 'list', component: HolidaysListComponent},
  {path: 'add', component: HolidaysFormComponent},
  {path: 'edit/:id', component: HolidaysFormComponent}
];
