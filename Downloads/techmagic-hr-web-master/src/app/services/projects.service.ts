import {Http, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

import {environment} from './../../environments/environment';
import {AuthService} from './auth.service';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class ProjectsService {
  private project = {};

  constructor(private http: Http, private auth: AuthService) {}

  getProjects() {
    return this.http.get(`${API_ENDPOINT}/user-group/project`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  createProject(project) {
    return this.http.post(`${API_ENDPOINT}/user-group/project`, project, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  updateProject(project, id) {
    return this.http.patch(`${API_ENDPOINT}/user-group/project/${id}`, project, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  getProject(id: string) {
    return this.http.get(`${API_ENDPOINT}/user-group/project/${id}`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }

  storeProject(data) {
    Object.assign(this.project, data);
  }

  getStoredProject() {
    return this.project;
  }

  deleteProject(id) {
    return this.http.delete(`${API_ENDPOINT}/user-group/project/${id}`, this.auth.generateHttpHeaders())
      .map((response: Response) => response);
  }
}
