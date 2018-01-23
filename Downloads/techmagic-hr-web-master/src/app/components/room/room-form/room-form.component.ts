import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit, OnDestroy} from '@angular/core';

import {RoomsService} from './../../../services';

@Component({
  selector: 'hr-room-form',
  templateUrl: 'room-form.component.html',
  styleUrls: ['room-form.component.sass']
})
export class RoomFormComponent implements OnInit, OnDestroy {
  roomId: string;
  room: any = {};
  private subscription: Subscription;

  constructor(private roomsService: RoomsService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.roomId = param['id'];
        if (this.roomId) {
          this.room = this.roomsService.getStoredRoom();
          this.getRoomInfo();
        }
      },
      error => console.error('Error: ', error)
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * @description - Handle form submit
   * @param {any} addRoomForm
   * @memberOf RoomFormComponent
   */
  onSubmit(addRoomForm): void {
    if (addRoomForm.valid) {
      if (this.roomId) {
        this.subscription = this.roomsService.updateRoom(addRoomForm.value, this.roomId).subscribe(
          () => this.router.navigate(['/rooms/list']),
          error => console.error('Error: ', error)
        );
      } else {
        this.subscription = this.roomsService.createRoom(addRoomForm.value).subscribe(
          () => this.router.navigate(['rooms/list']),
          error => console.error('Error: ', error)
        );
      }
    }
  }

  /**
   * @description - Get room info for editing it
   * @memberOf RoomFormComponent
   */
  getRoomInfo(): void {
    this.roomsService.getRoom(this.roomId).subscribe(
      room => this.roomsService.storeRoom(room),
      error => console.error('Error: ', error)
    );
  }

  goToList(): void {
    this.router.navigate(['rooms/list']);
  }

  deleteRoom() {
    this.subscription = this.roomsService.deleteRoom(this.roomId).subscribe(
      () => this.router.navigate(['rooms/list']),
      error => console.error('Error: ', error)
    );
  }

}
