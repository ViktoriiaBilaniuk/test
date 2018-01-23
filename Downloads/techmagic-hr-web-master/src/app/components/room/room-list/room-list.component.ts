import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {RoomsService, SpinnerService} from './../../../services';
import {ROOM} from './../../../models';

@Component({
  selector: 'hr-room-list',
  templateUrl: 'room-list.component.html',
  styleUrls: ['room-list.component.sass']
})
export class RoomListComponent implements OnInit, OnDestroy {
  rooms: ROOM[];
  private subscription: Subscription;

  constructor(private roomService: RoomsService,
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
    this.subscription = this.roomService.getRooms().subscribe(
      (res) => {
        this.rooms = res;
        this.spinnerService.hideSpinner();
      },
      (error) => {
        console.error('Error: ', error);
        this.spinnerService.hideSpinner();
      }
    );
  }

}
