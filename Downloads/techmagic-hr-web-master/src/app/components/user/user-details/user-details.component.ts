import { AuthService } from './../../../services/auth.service';
import {SpinnerService} from './../../../services/spinner.service';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {USER} from './../../../models';
import {UsersService, NotesService} from './../../../services';

@Component({
  selector: 'hr-user-detail',
  templateUrl: './user-details.component.html',
  styleUrls: ['user-details.component.sass']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private userId: string;
  private loggedUser = this.auth.getLoggedUserData();
  user: USER = this.usersService.getStoredUser();

  defaultUserPhoto = './../../../assets/img/icon-user-default.png';

  userAccesslevel = this.loggedUser.role;
  isOwnProfile: boolean;

  constructor(private activetedRoute: ActivatedRoute,
              private usersService: UsersService,
              private auth: AuthService,
              private notesService: NotesService,
              private spinnerService: SpinnerService,
              private router: Router) {
  }

  ngOnInit() {
    this.activetedRoute.params.subscribe(
      (param: any) => {
        this.userId = param['id'];
        this.isOwnProfile = this.userId === this.loggedUser._id;
        this.getUserData();
        this.createNotesChangeListener();
      },
      error => console.error('Error: ', error)
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.usersService.resetStoredUser();
  }

  getUserData() {
    this.spinnerService.showSpinner();
    this.usersService.getUser(this.userId).subscribe(
      (user) => {
        this.usersService.storeUser(user);
        this.spinnerService.hideSpinner();
      },
      error => {
        console.error('Error: ', error);
        this.spinnerService.hideSpinner();
      }
    );
  }

  createNotesChangeListener() {
    this.subscription = this.notesService.notesChanged.subscribe(() => this.getUserData());
  }

  goToEditUser(): void {
    this.router.navigate(['employees/edit', this.userId]);
  }

  disableImg(e) {
    e.preventDefault();
  }

  download(e) {
    window.open(e.target.attributes['href'].value);
  }
}
