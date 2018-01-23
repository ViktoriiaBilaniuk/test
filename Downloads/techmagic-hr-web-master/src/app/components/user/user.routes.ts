import {Routes} from '@angular/router';

import {USER_DETAIL_ROUTES} from './user-details/user-details.routes';
import {UserFormComponent} from './user-form/user-form.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserDetailComponent} from './user-details/user-details.component';
import {BirthdaysComponent} from './birthdays/birthdays.component';
import {NewcomersComponent} from './newcomers/newcomers.component';
import {PDPComponent} from './pdp/pdp.component';

import {AuthGuard} from './../../services';
import {EmployeesGuard} from './../../services/employees-guards';
import {UserFormGuard} from '../../services/user-form.guard';

export const USER_ROUTES: Routes = [
  {path: 'add', component: UserFormComponent, canActivate: [AuthGuard, EmployeesGuard], canDeactivate: [UserFormGuard]},
  {path: 'edit/:id', component: UserFormComponent, canActivate: [AuthGuard, EmployeesGuard], canDeactivate: [UserFormGuard]},
  {path: 'list/:id', component: UserDetailComponent, children: USER_DETAIL_ROUTES},
  {path: 'list', component: UserListComponent, canActivate: [AuthGuard], data: {
    elements: {
      addBtn: true,
      filterByLead: true,
      filterByProject: true,
      filterByDepartment: true,
      filterByReason: false,
      filterByRoom: true,
      search: true
    },
    query: {
      'lastWorkingDay': false
    }
  }},
  {path: 'birthdays', component: BirthdaysComponent, canActivate: [AuthGuard, EmployeesGuard]},
  {path: 'pdp', component: PDPComponent, canActivate: [AuthGuard, EmployeesGuard]},
  {path: 'old-list', component: UserListComponent, canActivate: [AuthGuard, EmployeesGuard], data: {
    elements: {
      addBtn: false,
      filterByLead: false,
      filterByProject: true,
      filterByDepartment: true,
      filterByReason: true,
      search: true
    },
    query: {
      'lastWorkingDay': true
    }
  }},
  {path: 'new-list', component: NewcomersComponent, canActivate: [AuthGuard]},
  {
    path: 'analytics',
    loadChildren: 'app/components/analytics/analytics.module#AnalyticsModule',
    canActivate: [AuthGuard, EmployeesGuard]
  }
];
