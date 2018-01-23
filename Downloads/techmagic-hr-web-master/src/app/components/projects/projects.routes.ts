import {Routes} from '@angular/router';

import {ProjectFormComponent} from './projects-form/projects-form.component';
import {ProjectListComponent} from './projects-list/projects-list.component';
import {AuthGuard} from './../../services';

export const PROJECT_ROUTES: Routes = [
  {path: 'add', component: ProjectFormComponent, canActivate: [AuthGuard]},
  {path: 'list', component: ProjectListComponent, canActivate: [AuthGuard]},
  {path: 'edit/:id', component: ProjectFormComponent, canActivate: [AuthGuard]}
];
