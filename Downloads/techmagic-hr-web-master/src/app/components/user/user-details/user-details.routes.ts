import {Routes} from '@angular/router';
import {UserDetailsPersonalComponent} from './user-details-personal/user-details-personal.component';
import {NotesListComponent} from './user-details-notes/notes-list/notes-list.component';
import {NotesFormComponent} from './user-details-notes/notes-form/notes-form.component';
import {UserDetailsPdpComponent} from './user-details-pdp/user-details-pdp.component';
import {UserDetailsDocumentsComponent} from './user-details-documents/user-details-documents.component';
import {UserDetailsTimeOffComponent} from './user-details-time-off/user-details-time-off.component';
import {AuthGuard} from './../../../services/auth-guards';

export const USER_DETAIL_ROUTES: Routes = [
  {path: 'personal', component: UserDetailsPersonalComponent, canActivate: [AuthGuard]},
  {path: 'pdp', component: UserDetailsPdpComponent, canActivate: [AuthGuard]},
  {path: 'documents', component: UserDetailsDocumentsComponent, canActivate: [AuthGuard]},
  {path: 'notes/list', component: NotesListComponent, canActivate: [AuthGuard]},
  {path: 'notes/add', component: NotesFormComponent, canActivate: [AuthGuard]},
  {path: 'notes/edit/:noteId', component: NotesFormComponent, canActivate: [AuthGuard]},
  {path: 'time-off/vacation', redirectTo: 'time-off/vacation/current', pathMatch: 'full'},
  {
    path: 'time-off/vacation/current',
    component: UserDetailsTimeOffComponent,
    data: {name: 'vacation', tab: 'current'},
    canActivate: [AuthGuard]
  },
  {
    path: 'time-off/vacation/next',
    component: UserDetailsTimeOffComponent,
    data: {name: 'vacation', tab: 'next'},
    canActivate: [AuthGuard]
  },
  {path: 'time-off/illness', redirectTo: 'time-off/illness/current', pathMatch: 'full'},
  {
    path: 'time-off/illness/current',
    component: UserDetailsTimeOffComponent,
    data: {name: 'illness', tab: 'current'},
    canActivate: [AuthGuard]
  },
  {
    path: 'time-off/illness/next',
    component: UserDetailsTimeOffComponent,
    data: {name: 'illness', tab: 'next'},
    canActivate: [AuthGuard]
  },
  {path: 'time-off/business-trip', redirectTo: 'time-off/business-trip/current', pathMatch: 'full'},
  {
    path: 'time-off/business-trip/current',
    component: UserDetailsTimeOffComponent,
    data: {name: 'businessTrip', tab: 'current'},
    canActivate: [AuthGuard]
  },
  {
    path: 'time-off/business-trip/next',
    component: UserDetailsTimeOffComponent,
    data: {name: 'businessTrip', tab: 'next'},
    canActivate: [AuthGuard]
  }
];
