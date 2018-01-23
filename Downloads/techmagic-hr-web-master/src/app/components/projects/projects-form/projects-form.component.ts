import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';
import 'rxjs/add/operator/map';

import {ProjectsService} from './../../../services';
import {UsersService} from './../../../services';

@Component({
  selector: 'hr-projects-form',
  templateUrl: 'projects-form.component.html',
  styleUrls: ['projects-form.component.sass']
})
export class ProjectFormComponent implements OnInit, OnDestroy {
  public employees;
  public projectId: string;
  public project: any = {_users: []};
  private subscription: Subscription;

  constructor(private projectsService: ProjectsService,
              private activatedRoute: ActivatedRoute,
              private usersService: UsersService,
              private router: Router) {}

  ngOnInit() {
    this.usersService.getAllUsers().subscribe(
      (res => this.transformUsers(res)),
      error => console.error('Error ', error)
    );

    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.projectId = param['id'];
        this.getProjectInfo();
      },
      error => console.error('Error: ', error)
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  transformUsers(res) {
    this.employees = res.docs.map((item) => {
      return {
        display: `${item.firstName} ${item.lastName}`,
        value: item._id
      };
    });
  }

  /**
   * @description - Handle form submit
   * @param {any} addProjectForm
   * @memberOf ProjectFormComponent
   */
  onSubmit(addProjectForm): void {
    if (addProjectForm.valid) {
      let projData = Object.assign({}, this.project);
      projData._users = projData._users.map((value) => value.value);
      if (this.projectId) {
        this.updateProject(projData);
      } else {
        this.createProject(projData);
      }
    }
  }

  updateProject(projData) {
    this.subscription = this.projectsService.updateProject(projData, this.projectId).subscribe(
      () => this.router.navigate(['/projects/list']),
      error => console.error('Error: ', error)
    );
  }

  createProject(projData) {
    this.subscription = this.projectsService.createProject(projData).subscribe(
      () => this.router.navigate(['projects/list']),
      error => console.error('Error: ', error)
    );
  }

  /**
   * @description - Get project info for editing it
   * @memberOf ProjectFormComponent
   */
  getProjectInfo(): void {
    if (this.projectId) {
      this.projectsService.getProject(this.projectId).subscribe(
        project => this.project = project,
        error => console.error('Error: ', error)
      );
    }
  }

  goToList(): void {
    this.router.navigate(['projects/list']);
  }

  deleteProject() {
    this.subscription = this.projectsService.deleteProject(this.projectId).subscribe(
      () => this.router.navigate(['projects/list']),
      error => console.error('Error: ', error)
    );
  }

  onItemAdded(user) {
    this.project._users.push(user);
    setTimeout( () => {
      $('.btn.btn-warning.control-btn').focus();
    }, 0);
  }

  onItemRemoved(user) {
    const tempArr = [].concat(this.project._users);
    const index = tempArr.indexOf(user);
    if (index > -1) {
      tempArr.splice(index, 1);
    }
    this.project._users = tempArr;
  }

}
