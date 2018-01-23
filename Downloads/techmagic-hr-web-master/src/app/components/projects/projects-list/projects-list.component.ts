import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProjectsService, SpinnerService} from './../../../services';
import {PROJECT} from './../../../models';

@Component({
  selector: 'hr-projects-list',
  templateUrl: 'projects-list.component.html',
  styleUrls: ['projects-list.component.sass']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  public projects: PROJECT[];
  private subscription: Subscription;

  constructor(private projectsService: ProjectsService,
              private spinnerService: SpinnerService) {
  }

  ngOnInit() {
    this.spinnerService.showSpinner();
    this.getRooms();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.spinnerService.hideSpinner();
  }

  getRooms() {
    this.subscription = this.projectsService.getProjects().subscribe(
      (res) => {
        this.projects = res;
        this.spinnerService.hideSpinner();
      },
      (error) => {
        console.error('Error: ', error);
        this.spinnerService.hideSpinner();
      }
    );
  }

}
