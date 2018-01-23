import {Routes} from '@angular/router';

import {DepartmentsListComponent} from './departments-list/departments-list.component';
import {DepartmentsFormComponent} from './departments-form/departments-form.component';
import {AuthGuard} from './../../services';

export const DEPARTMENTS_ROUTES: Routes = [
  {path: 'list', component: DepartmentsListComponent, canActivate: [AuthGuard]},
  {path: 'add', component: DepartmentsFormComponent, canActivate: [AuthGuard]},
  {path: 'edit/:id', component: DepartmentsFormComponent, canActivate: [AuthGuard]}
];
