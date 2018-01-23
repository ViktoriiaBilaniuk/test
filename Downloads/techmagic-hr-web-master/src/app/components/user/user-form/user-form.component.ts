import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import {
  AuthService,
  DepartmentsService,
  UsersService,
  RoomsService,
  HolidaysService,
  ReasonsService,
  SpinnerService
} from './../../../services';

@Component({
  selector: 'hr-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['user-form.component.sass']
})
export class UserFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('addUserForm') addUserForm;
  userId: string;
  user: any = {};
  formIsSubmited: boolean;
  invalidFirstWorkingDay: boolean;
  rooms;
  departments;
  reasons;
  disabledReason: boolean = true;
  isOwnProfile: boolean;
  loggedUser = this.auth.getLoggedUserData();
  currentUserRole = this.loggedUser.role;
  tr_isCurrentUserAdmin = this.loggedUser.tr_isAdmin;
  serverError = '';
  firstNameInvalid = false;
  lastNameInvalid = false;
  invalidImgMsg = '';
  invalidLwdMsg = '';
  invalidTpeMsg = '';
  private subscription: Subscription;
  private formData: FormData = new FormData();
  private file: File;
  private leads;
  public linkPattern = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/;
  public firstNamePattern = /^[^\s][A-Za-z\- ]*[^\s]$/;
  public lastNamePattern = /^[^\s][A-Za-z\- ]*[^\s]$/;

  constructor(private usersService: UsersService,
              private roomService: RoomsService,
              private departmentService: DepartmentsService,
              private holidaysService: HolidaysService,
              private reasonsService: ReasonsService,
              private spinnerService: SpinnerService,
              private auth: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.usersService.isFirstTimeExit = true;
    this.usersService.isUserFormChanged = false;
    this.onBeforeunload = this.onBeforeunload.bind(this);

    window.addEventListener('beforeunload', this.onBeforeunload);
  }

  ngOnInit() {
    this.initDatePicker();
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.userId = param['id'];
        if (this.userId) {
          this.isOwnProfile = this.userId === this.loggedUser._id;
          this.user = this.usersService.getStoredUser();
          this.getUserInfo();
        } else {
          this.setDefPropForSelect();
        }
      },
      error => console.error('Error: ', error)
    );
    this.getRooms();
    this.getDepartments();
    this.getLeads();
    this.getReasons();
  }

  ngAfterViewInit() {
    this.addUserForm.control.valueChanges.subscribe(data => {
      if (this.addUserForm.dirty) {
        this.usersService.userFormSubject.next({isUserFormChanged: true});
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    window.removeEventListener('beforeunload', this.onBeforeunload);
  }

  onBeforeunload(e) {
    if (this.usersService.isUserFormChanged && this.usersService.isFirstTimeExit) {
      this.usersService.isFirstTimeExit = false;

      (e || window.event).returnValue = 'You have unsaved changes!';

      return 'You have unsaved changes!';
    }
  }

  /**
   * @description - Handle form submit
   * @param {any} addUserForm
   * @memberOf UserFormComponent
   */
  onSubmit(addUserForm): void {

    this.serverError = '';
    // check if form is valid
    if (addUserForm.valid && $('#datepicker-fwd').datepicker('getDate') &&
        (!this.file || this.file.size <= 5242880)) {

      if (this.checkNames(addUserForm.value)) {
        const formatedUserDate = this.formatUserData(addUserForm.value);
        this.checkDatesOrders(formatedUserDate);
        if (this.invalidLwdMsg || this.invalidTpeMsg) {
          return this.showValidation();
        }
        this.spinnerService.showSpinner();
        // check if it is editing
        if (this.userId) {
          this.updateUser(formatedUserDate);
        } else {
          this.createUser(formatedUserDate);
        }

        this.usersService.isUserFormChanged = false;
      } else {
        this.showValidation();
      }

    } else {
      this.showValidation();
    }
  }

  /**
   * @description Method for updating user
   * @param {any} formatedUserDate
   * @memberOf UserFormComponent
   */
  updateUser(formatedUserDate) {
    this.subscription = this.usersService.updateUser(formatedUserDate, this.userId).subscribe(
      (data) => {
        // check if user edit own profile
        if (this.isOwnProfile) {
          this.auth.resetFullName(formatedUserDate.firstName, formatedUserDate.lastName);
        }
        // upload avatar if it is attached
        if (this.file) {
          this.uploadPhoto(data._id);
        } else {
          this.spinnerService.hideSpinner();
          this.goBack();
        }
      },
      error => this.handleServerError(error)
    );
  }

  /**
   * @description Method for creating new user
   * @param {any} formatedUserDate
   * @memberOf UserFormComponent
   */
  createUser(formatedUserDate) {
    this.subscription = this.usersService.createUser(formatedUserDate).subscribe(
      (data) => {
        // upload avatar if it is attached
        if (this.file) {
          this.uploadPhoto(data._id);
        } else {
          this.spinnerService.hideSpinner();
          this.goBack();
        }
      },
      error => this.handleServerError(error)
    );
  }

  checkNames(formData) {
    if (formData.firstName && formData.lastName) {
      const validFN = formData.firstName.trim().match(this.firstNamePattern);
      const validLN = formData.lastName.trim().match(this.lastNamePattern);
      if (validFN && validLN) {
        return true;
      } else {
        this.firstNameInvalid = !validFN;
        this.lastNameInvalid = !validLN;
      }
    } else {
      return true;
    }
  }

  handleServerError(err) {
    console.error('Error: ', err);
    this.serverError = JSON.parse(err._body).message;
    this.spinnerService.hideSpinner();
  }

  showValidation() {
    this.formIsSubmited = true;
    $('#userForm').addClass('submited');
    if ($('#datepicker-fwd').datepicker('getUTCDate') === null) {
      $('#datepicker-fwd').addClass('ng-invalid');
      this.invalidFirstWorkingDay = true;
    }
    $('#datepicker-fwd').datepicker().on('changeDate', () => {
      $('#datepicker-fwd').removeClass('ng-invalid');
      $('#datepicker-lwd').removeClass('ng-invalid');
      $('#datepicker-tpe').removeClass('ng-invalid');
      this.invalidFirstWorkingDay = false;
      this.invalidLwdMsg = '';
      this.invalidTpeMsg = '';
    });

    if (this.invalidLwdMsg) {
      $('#datepicker-lwd').addClass('ng-invalid');
      $('#datepicker-lwd').datepicker().on('changeDate', () => {
        $('#datepicker-lwd').removeClass('ng-invalid');
        $('#datepicker-tpe').removeClass('ng-invalid');
        this.invalidLwdMsg = '';
        this.invalidTpeMsg = '';
      });
    }

    if (this.invalidTpeMsg) {
      $('#datepicker-tpe').addClass('ng-invalid');

      $('#datepicker-tpe').datepicker().on('changeDate', () => {
        $('#datepicker-tpe').removeClass('ng-invalid');
        this.invalidTpeMsg = '';
      });
    }

    if (this.file && this.file.size > 5242880) {
      this.invalidImgMsg = 'File size exceeds 5mb. Resize the picture or choose a different one';
    }
  }

  /**
   * @description - Get user info for editing it
   * @memberOf UserFormComponent
   */
  getUserInfo(): void {
    this.usersService.getUser(this.userId).subscribe(
      (user) => {
        // prevent HR to edit admin
        if (user.role === 2 && !this.isOwnProfile) {
          return this.goBack();
        }
        this.usersService.storeUser(user);
        this.setDefPropForSelect();
        this.setConvertedDates();
      },
      error => console.error('Error: ', error)
    );
  }

  goBack(): void {
    if (this.userId) {
      this.router.navigate(['/employees/list', this.userId, 'personal']);
    } else {
      this.router.navigate(['employees/list']);
    }
  }

  /**
   * @description Set default property for select inputs to correct displaying
   * @memberOf UserFormComponent
   */
  setDefPropForSelect(): void {
    if (typeof this.user.role !== 'number') {
      this.user.role = '';
    }
    this.user.gender = this.user.gender ? String(this.user.gender) : '0';
  }

  /**
   * @description Format user data before sending to server
   * > Format time to timestamp
   * > convert role field to number
   * @param {any} userObj
   * @returns {any} userObj
   * @memberOf UserFormComponent
   */
  formatUserData(userObj) {
    if ($('#datepicker-bth').datepicker('getDate')) {
      userObj.birthday = new Date($('#datepicker-bth').datepicker('getUTCDate')).getTime();
    } else {
      userObj.birthday = null;
    }
    if ($('#datepicker-fwd').datepicker('getDate')) {
      userObj.firstWorkingDay = new Date($('#datepicker-fwd').datepicker('getUTCDate')).getTime();
    }
    if ($('#datepicker-gfwd').datepicker('getDate')) {
      userObj.generalFirstWorkingDay = new Date($('#datepicker-gfwd').datepicker('getUTCDate')).getTime();
    } else {
      userObj.generalFirstWorkingDay = null;
    }
    if ($('#datepicker-lwd').datepicker('getDate')) {
      userObj.lastWorkingDay = new Date($('#datepicker-lwd').datepicker('getUTCDate')).getTime();
    } else {
      userObj.lastWorkingDay = null;
    }
    if ($('#datepicker-tpe').datepicker('getDate')) {
      userObj.trialPeriodEnds = new Date($('#datepicker-tpe').datepicker('getUTCDate')).getTime();
    } else {
      userObj.trialPeriodEnds = null;
    }

    // Convert emergency propery to nested object
    const emergencyPhone = userObj.emergencyPhone;
    const emergencyName = userObj.emergencyName;
    delete userObj.emergencyPhone;
    delete userObj.emergencyName;
    if (!userObj.password) {
      delete userObj.password;
    }
    if (this.isOwnProfile) {
      delete userObj.role;
    } else {
      // if user role is hide(for all users accept admin) assign it to initial value
      if (userObj.role === undefined) {
        userObj.role = this.user.role || 0;
      } else {
        // else - get value from form
        userObj.role = parseInt(userObj.role, 10) || 0;
      }
    }

    userObj.emergencyContact = {
      phone: emergencyPhone,
      name: emergencyName
    };

    return userObj;
  }

  /**
   * @description - Listen for changes on file input
   * @param {any} event
   * @memberOf UserFormComponent
   */
  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      this.invalidImgMsg = '';
    }
  }

  /**
   * @description - Upload photo method
   * > Append file to formData
   * > Send formData to server
   * @memberOf UserFormComponent
   */
  uploadPhoto(id) {
    this.formData.append('photo', this.file);
    this.usersService.uploadPhoto(this.formData, id).subscribe(
      data => {
        // check if user edit own profile
        if (this.isOwnProfile) {
          this.auth.resetPhoto(data.photo);
        }
        this.spinnerService.hideSpinner();
        this.goBack();
      },
      error => this.handleServerError(error)
    );
  }

  /**
   * @description - Get rooms to display in select field
   * @memberOf UserFormComponent
   */
  getRooms(): void {
    this.subscription = this.roomService.getRooms().subscribe(
      (rooms) => this.rooms = rooms,
      error => console.error(error)
    );
  }

  /**
   * @description - Get departments to display in select field
   * @memberOf UserFormComponent
   */
  getDepartments(): void {
    this.subscription = this.departmentService.getDepartments().subscribe(
      (departments) => this.departments = departments,
      error => console.error(error)
    );
  }

  /**
   * @description - Get departments to display in select field
   * @memberOf UserFormComponent
   */
  getReasons(): void {
    this.subscription = this.reasonsService.getReasons().subscribe(
      (res) => this.reasons = res,
      error => console.error(error)
    );
  }

  getLeads() {
    this.subscription = this.holidaysService.getLeads().subscribe(
      (leads) => this.leads = leads,
      error => console.error(error)
    );
  }

  removeUser() {
    this.usersService.removeUser(this.userId).subscribe(
      () => this.router.navigate(['employees/list']),
      error => console.error('Error: ', error)
    );
  }

  initDatePicker() {
    $('.hr-datepicker input').datepicker({
      todayHighlight: true,
      weekStart: 1,
      autoclose: true,
      endDate: '+100Y',
      startDate: '-100Y',
      format: 'dd/mm/yyyy'
    }).on('changeDate', (e) => {
      this.invalidLwdMsg = '';
      this.invalidTpeMsg = '';

      if (e.target.getAttribute('name') === 'lastWorkingDay') {
        this.disabledReason = false;
      }

    });
  }

  checkDatesOrders(userData) {
    if (userData.lastWorkingDay && userData.lastWorkingDay < userData.firstWorkingDay) {
      this.invalidLwdMsg = 'Last working day can\'t be earlier than first working day';
    }
    if (userData.trialPeriodEnds && userData.trialPeriodEnds < userData.firstWorkingDay) {
      this.invalidTpeMsg = 'Trial period end can\'t be earlier than first working day';
    } else if (userData.lastWorkingDay && userData.trialPeriodEnds > userData.lastWorkingDay) {
      this.invalidTpeMsg = 'Trial period end can\'t be later than last working day';
    }
  }

  setConvertedDates() {
    if (this.user.birthday) {
      $('#datepicker-bth').datepicker('setUTCDate', new Date(this.user.birthday));
    }

    if (this.user.firstWorkingDay) {
      $('#datepicker-fwd').datepicker('setUTCDate', new Date(this.user.firstWorkingDay));
    }

    if (this.user.generalFirstWorkingDay) {
      $('#datepicker-gfwd').datepicker('setUTCDate', new Date(this.user.generalFirstWorkingDay));
    }

    if (this.user.lastWorkingDay) {
      $('#datepicker-lwd').datepicker('setUTCDate', new Date(this.user.lastWorkingDay));
    }

    if (this.user.trialPeriodEnds) {
      $('#datepicker-tpe').datepicker('setUTCDate', new Date(this.user.trialPeriodEnds));
    }
  }

}
