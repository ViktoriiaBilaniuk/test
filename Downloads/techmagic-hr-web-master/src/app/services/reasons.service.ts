import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {environment} from './../../environments/environment';
import {AuthService} from './auth.service';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class ReasonsService {
  private reason = {};

  constructor(private http: Http, private auth: AuthService) {}

  getReasons() {
    return this.http.get(`${API_ENDPOINT}/reasons`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  createReason(reason) {
    return this.http.post(`${API_ENDPOINT}/reasons`, reason, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  updateReason(reason, id) {
    return this.http.patch(`${API_ENDPOINT}/reasons/${id}`, reason, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getReason(id: string) {
    return this.http.get(`${API_ENDPOINT}/reasons/${id}`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  storeReason(data) {
    Object.keys(data).forEach((key) => {
      this.reason[key] = data[key];
    });
  }

  getStoredReason() {
    return this.reason;
  }

  deleteReason(id) {
    return this.http.delete(`${API_ENDPOINT}/reasons/${id}`, this.auth.generateHttpHeaders())
      .map((response: Response) => response);
  }
}
