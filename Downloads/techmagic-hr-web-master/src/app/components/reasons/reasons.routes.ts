import {Routes} from '@angular/router';
import {ReasonFormComponent} from './reasons-form/reasons-form.component';
import {ReasonListComponent} from './reasons-list/reasons-list.component';
import {AuthGuard} from './../../services';

export const REASONS_ROUTES: Routes = [
  {path: 'add', component: ReasonFormComponent, canActivate: [AuthGuard]},
  {path: 'list', component: ReasonListComponent, canActivate: [AuthGuard]},
  {path: 'edit/:id', component: ReasonFormComponent, canActivate: [AuthGuard]}
];
