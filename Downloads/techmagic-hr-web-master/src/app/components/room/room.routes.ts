import {Routes} from '@angular/router';

import {RoomFormComponent} from './room-form/room-form.component';
import {RoomListComponent} from './room-list/room-list.component';
import {AuthGuard} from './../../services';

export const ROOM_ROUTES: Routes = [
  {path: 'add', component: RoomFormComponent, canActivate: [AuthGuard]},
  {path: 'list', component: RoomListComponent, canActivate: [AuthGuard]},
  {path: 'edit/:id', component: RoomFormComponent, canActivate: [AuthGuard]}
];
