import {Response, Http} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {environment} from './../../environments/environment';
import {AuthService} from './auth.service';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class DepartmentsService {

  constructor(private http: Http, private auth: AuthService) {}

  getDepartments() {
    return this.http.get(`${API_ENDPOINT}/departments`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  createDepartment(department) {
    return this.http.post(`${API_ENDPOINT}/departments`, department, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  updateDepartment(department, id) {
    return this.http.patch(`${API_ENDPOINT}/departments/${id}`, department, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getDepartment(id: string) {
    return this.http.get(`${API_ENDPOINT}/departments/${id}`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  deleteDepartment(id) {
    return this.http.delete(`${API_ENDPOINT}/departments/${id}`, this.auth.generateHttpHeaders())
      .map((response: Response) => response);
  }
}
