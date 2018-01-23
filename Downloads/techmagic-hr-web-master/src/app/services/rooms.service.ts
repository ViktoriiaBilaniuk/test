import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {environment} from './../../environments/environment';
import {AuthService} from './auth.service';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class RoomsService {
  private room = {};

  constructor(private http: Http, private auth: AuthService) {}

  getRooms() {
    return this.http.get(`${API_ENDPOINT}/rooms`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  createRoom(room) {
    return this.http.post(`${API_ENDPOINT}/rooms`, room, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  updateRoom(room, id) {
    return this.http.patch(`${API_ENDPOINT}/rooms/${id}`, room, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getRoom(id: string) {
    return this.http.get(`${API_ENDPOINT}/rooms/${id}`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  storeRoom(data) {
    Object.keys(data).forEach((key) => {
      this.room[key] = data[key];
    });
  }

  getStoredRoom() {
    return this.room;
  }

  deleteRoom(id) {
    return this.http.delete(`${API_ENDPOINT}/rooms/${id}`, this.auth.generateHttpHeaders())
      .map((response: Response) => response);
  }
}
