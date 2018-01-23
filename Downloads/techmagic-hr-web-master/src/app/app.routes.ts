import { LoggedUserDataProvider } from './services/loggedUserData.provider';
import {Routes} from '@angular/router';
import {
  UserComponent,
  LoginComponent,
  NoContentComponent,
  SignUpComponent,
  ResetPasswordComponent,
  ForgotPasswordComponent,
  CalendarComponent,
  HolidaysComponent,
  RoomComponent,
  ReasonComponent,
  ProjectComponent,
  FinanceComponent,
  ConstantPageComponent,
  DepartmentsComponent,
  SharedCalendarComponent
} from './components';
import {USER_ROUTES} from './components/user/user.routes';
import {ROOM_ROUTES} from './components/room/room.routes';
import {REASONS_ROUTES} from './components/reasons/reasons.routes';
import {PROJECT_ROUTES} from './components/projects/projects.routes';
import {DEPARTMENTS_ROUTES} from './components/departments/departments.routes';
import {HOLIDAYS_ROUTES} from './components/holidays/holidays.routes';
import {AuthGuard, EmployeesGuard, LoggedUserGuard} from './services';

// Root Routes for App
export const ROUTES: Routes = [
  {path: '', redirectTo: 'employees/list', pathMatch: 'full'},
  {path: 'employees', component: UserComponent, children: USER_ROUTES, canActivate: [LoggedUserDataProvider]},
  {
    path: 'holidays',
    component: HolidaysComponent,
    children: HOLIDAYS_ROUTES,
    canActivate: [LoggedUserDataProvider, AuthGuard, EmployeesGuard]
  },
  {path: 'calendar', component: CalendarComponent, canActivate: [LoggedUserDataProvider, AuthGuard]},
  {path: 'finances', component: FinanceComponent, canActivate: [LoggedUserDataProvider, EmployeesGuard]},
  {path: 'finance-constants', component: ConstantPageComponent, canActivate: [LoggedUserDataProvider, AuthGuard]},
  {path: 'rooms', component: RoomComponent, children: ROOM_ROUTES, canActivate: [LoggedUserDataProvider, EmployeesGuard]},
  {path: 'reasons', component: ReasonComponent, children: REASONS_ROUTES, canActivate: [LoggedUserDataProvider, EmployeesGuard]},
  {path: 'projects', component: ProjectComponent, children: PROJECT_ROUTES, canActivate: [LoggedUserDataProvider, EmployeesGuard]},
  {
    path: 'departments',
    component: DepartmentsComponent,
    children: DEPARTMENTS_ROUTES,
    canActivate: [LoggedUserDataProvider, EmployeesGuard]
  },
  {path: 'login', component: LoginComponent, canActivate: [LoggedUserGuard]},
  {path: 'sign-up', component: SignUpComponent, canActivate: [LoggedUserGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [LoggedUserGuard]},
  {path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoggedUserGuard]},
  {path: 'shared-calendar', component: SharedCalendarComponent},
  {path: 'google-auth', redirectTo: 'employees/list', pathMatch: 'full'},
  {path: '**', component: NoContentComponent}
];
