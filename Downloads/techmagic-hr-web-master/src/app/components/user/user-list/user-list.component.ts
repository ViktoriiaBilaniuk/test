import { AuthService } from './../../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';

import { REASON, USER, PROJECT, DEPARTMENT, ROOM } from './../../../models';
import { DepartmentsService, ProjectsService, UsersService, SpinnerService, ReasonsService, RoomsService } from '../../../services';
import { PaginationComponent } from './../../common/pagination/pagination.component';

@Component({
  selector: 'hr-user-list',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.sass']
})
export class UserListComponent implements OnInit, OnDestroy {
  public reasons: REASON[];
  public users: USER[] = [];
  public projects: PROJECT[] = [];
  public departments: DEPARTMENT[] = [];
  public rooms: ROOM[] = [];

  public searchObj = {
    name: '',
    department: '',
    reason: '',
    project: '',
    lead: '',
    lwd: false,
    _room: ''
  };
  public elements: any = {};
  public query: object = {};
  public leads;
  public count: number;
  public offset: number;
  public loggedUser = this.auth.getLoggedUserData();
  public currentUserRole = this.loggedUser.role;

  @ViewChild(PaginationComponent)
  private subscription: Subscription;

  constructor(private userService: UsersService,
              private auth: AuthService,
              private departmentService: DepartmentsService,
              private projectsService: ProjectsService,
              private reasonService: ReasonsService,
              private spinnerService: SpinnerService,
              private activatedRoute: ActivatedRoute,
              private roomService: RoomsService,
              private router: Router) { }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.getFiltersValues();
    this.generateParamsFromUrl();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getFiltersValues() {
    this.activatedRoute.data.subscribe(
      (params) => {
        this.elements = params.elements;
        this.query = params.query;

        if (params.query.lastWorkingDay) {
          this.searchObj.lwd = params.query.lastWorkingDay;
        } else {
          this.searchObj.lwd = false;
        }
        if (params.elements.filterByDepartment) {
          this.getDepartments();
        }
        if (params.elements.filterByProject) {
          this.getProjects();
        }
        if (params.elements.filterByReason) {
          this.getReasons();
        }
        if (params.elements.filterByLead) {
          this.getLeads();
        }
        if (params.elements.filterByRoom) {
          this.getRooms();
        }
      }
    );
  }

  removeBlankProps(obj):object {
    const resultObj = Object.assign({}, obj);

    Object.keys(resultObj)
          .forEach(key => {
            if (!resultObj[key] && resultObj[key] !== false) delete resultObj[key];
          });

    return resultObj;
  }

  updateURL(): void {
    const currentQuery: object = this.removeBlankProps(this.searchObj);
    this.router.navigate(['..', this.activatedRoute.snapshot.url[0].path], {queryParams: {...currentQuery, 'of': this.offset}, relativeTo: this.activatedRoute});
  }

  userSearchOnChange() {
    this.offset = 0;
    this.updateURL();
  }

  /**
   * @description - Get users from server
   * @memberOf UserListComponent
   */
  getUsers(): void {
    this.subscription = this.userService.getUsers(this.searchObj, this.offset || 0).subscribe(
      (users) => {
        this.count = users['count'];
        this.users = users['docs'];
        window.scrollTo(0, 0);
        this.spinnerService.hideSpinner();
      },
      (error) => {
        this.spinnerService.hideSpinner();
        console.error('Error: ', error);
      }
    );
  }

  /**
   * @description - Get rooms from server
   * @memberOf UserListComponent
   */
  getRooms() {
    this.subscription = this.roomService.getRooms().subscribe(
      (res) => {
        this.rooms = res;
      },
      (error) => {
        console.error('Error: ', error);
      }
    );
  }

  getLeads() {
    this.subscription = this.userService.getLeadsWithEmployees().subscribe(
      (leads) => this.leads = leads,
      error => console.error(error)
    );
  }

  /**
   * @description - Search user by filtering or change page
   * > Annulate offset if search take place
   * @param {any} [offset]
   * @memberOf UserListComponent
   */
  searchUsers(offset?): void {
    if (typeof offset === 'number') {
      this.offset = offset;
    } else {
      this.offset = 0;
    }
    this.updateURL();
  }

  /**
   * @description - Generate filter params according to url queries
   * @memberOf UserListComponent
   */
  generateParamsFromUrl(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        this.searchObj.name = param['name'] || '';
        this.searchObj.department = param['department'] || '';
        this.offset = param['of'] || '';
        this.searchObj.lead = param['lead'] || '';
        this.searchObj.project = param['project'] || '';

        if (param['lwd'] && this.currentUserRole !== 0) {
          this.searchObj.lwd = JSON.parse(param['lwd']) || false;
        }
        this.getUsers();
      },
      error => console.error('Error: ', error)
    );
  }

  /**
   * @description - Get departments to display in select field
   * @memberOf UserListComponent
   */
  getDepartments() {
    this.subscription = this.departmentService.getDepartments().subscribe(
      (departments) => this.departments = departments,
      error => console.error(error)
    );
  }

  /**
   * @description - Get projects to display in select field
   * @memberOf UserListComponent
   */
  getProjects() {
    this.subscription = this.projectsService.getProjects().subscribe(
      (projects) => this.projects = projects,
      error => console.error(error)
    );
  }

  /**
   * @description - Get projects to display in select field
   * @memberOf UserListComponent
   */
  getReasons() {
    this.subscription = this.reasonService.getReasons().subscribe(
      (res) => this.reasons = res,
      (error) => console.error('Error: ', error)
    );
  }
}
