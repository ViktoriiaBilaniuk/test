import { RouterModule, PreloadAllModules } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TagInputModule } from 'ng2-tag-input';
import { NgModule, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, XHRBackend} from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { CookieModule } from 'ngx-cookie';
import { ROUTES } from './app.routes';
import { ClickOutsideModule } from 'ng-click-outside';
import {
  Http,
  RequestOptions
} from '@angular/http';

import {
UserComponent,
LoginComponent,
NoContentComponent,
HeaderComponent,
ConfirmationModalComponent,
UserListItemComponent,
UserDetailComponent,
UserListComponent,
SignUpComponent,
ForgotPasswordComponent,
ResetPasswordComponent,
UserFormComponent,
UserDetailsPersonalComponent,
UserDetailsPdpComponent,
UserDetailsDocumentsComponent,
HolidaysComponent,
HolidaysListComponent,
HolidaysListItemComponent,
HolidaysFormComponent,
CalendarComponent,
NotesListComponent,
NotesListItemComponent,
NotesFormComponent,
BirthdaysComponent,
PDPComponent,
FinanceComponent,
RoomComponent,
RoomListComponent,
RoomListItemComponent,
RoomFormComponent,
ReasonListComponent,
ReasonListItemComponent,
ReasonFormComponent,
ReasonComponent,
ProjectComponent,
ProjectListComponent,
ProjectListItemComponent,
ProjectFormComponent,
FooterComponent,
SpinnerComponent,
PaginationComponent,
DepartmentsComponent,
DepartmentsListComponent,
DepartmentsListItemComponent,
DepartmentsFormComponent,
ConstantPageComponent,
DatepickerComponent,
FileButtonComponent,
FinanceModalComponent,
GoogleBtnComponent,
NewcomersComponent,
UserDetailsTimeOffComponent,
SharedCalendarComponent,
CalendarModalComponent,
MessageComponent
} from './components';

import {
RoomsService,
ReasonsService,
DepartmentsService,
UsersService,
AuthService,
CalendarService,
AuthGuard,
LoggedUserDataProvider,
LoggedUserGuard,
EmployeesGuard,
NotesService,
HolidaysService,
SpinnerService,
ProjectsService,
FinancesService,
TimeOffService,
SharedCalendarService,
MessageService,
UserFormGuard,
HelpersService,
HttpInterceptor
} from './services';

import {
  SyncScrollDirective,
  ScrollCenteringDirective
} from './directives';

import { AppComponent } from './app.component';
import { AdditionalModalComponent } from './components/finance/additional-modal/additional-modal.component';

enableProdMode();

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    LoginComponent,
    NoContentComponent,
    HeaderComponent,
    ConfirmationModalComponent,
    UserListItemComponent,
    UserDetailComponent,
    UserListComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    UserFormComponent,
    UserDetailsPersonalComponent,
    UserDetailsPdpComponent,
    UserDetailsDocumentsComponent,
    HolidaysComponent,
    HolidaysListComponent,
    HolidaysListItemComponent,
    HolidaysFormComponent,
    CalendarComponent,
    NotesListComponent,
    NotesListItemComponent,
    NotesFormComponent,
    BirthdaysComponent,
    PDPComponent,
    FinanceComponent,
    FooterComponent,
    SpinnerComponent,
    RoomListComponent,
    RoomListItemComponent,
    RoomFormComponent,
    RoomComponent,
    ReasonListComponent,
    ReasonListItemComponent,
    ReasonFormComponent,
    ReasonComponent,
    ProjectComponent,
    ProjectListComponent,
    ProjectListItemComponent,
    ProjectFormComponent,
    PaginationComponent,
    DepartmentsComponent,
    DepartmentsFormComponent,
    DepartmentsListComponent,
    DepartmentsListItemComponent,
    UserDetailsTimeOffComponent,
    ConstantPageComponent,
    DatepickerComponent,
    FileButtonComponent,
    FinanceModalComponent,
    NewcomersComponent,
    GoogleBtnComponent,
    SharedCalendarComponent,
    CalendarModalComponent,
    SyncScrollDirective,
    ScrollCenteringDirective,
    MessageComponent,
    AdditionalModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    TagInputModule,
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
    CookieModule.forRoot(),
    ClickOutsideModule
  ],
  providers: [
    JwtHelper,
    UsersService,
    AuthService,
    CalendarService,
    AuthGuard,
    LoggedUserDataProvider,
    LoggedUserGuard,
    EmployeesGuard,
    RoomsService,
    ReasonsService,
    ProjectsService,
    DepartmentsService,
    NotesService,
    HolidaysService,
    SpinnerService,
    TimeOffService,
    FinancesService,
    SharedCalendarService,
    MessageService,
    UserFormGuard,
    HelpersService,
    {
      provide: Http,
      useClass: HttpInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
