import {Http, Response} from '@angular/http';
import {Injectable, EventEmitter} from '@angular/core';
import 'rxjs/add/operator/map';

import {environment} from './../../environments/environment';
import {UsersService} from './users.service';
import {AuthService} from './auth.service';

const API_ENDPOINT = environment.apiEndpoint;

@Injectable()
export class NotesService {
  notesChanged = new EventEmitter();

  constructor(private http: Http,
              private auth: AuthService,
              private userService: UsersService) {}

  getNote(noteId) {
    const note = this.userService.getStoredUser().notes.filter((val) => val._id === noteId);
    return note[0];
  }

  createNote(userId, noteData) {
    return this.http.post(`${API_ENDPOINT}/users/${userId}/notes`, noteData, this.auth.generateHttpHeaders())
      .map((response) => response);
  }

  updateNote(userId, noteId, noteData) {
    return this.http.patch(`${API_ENDPOINT}/users/${userId}/notes/${noteId}`, noteData, this.auth.generateHttpHeaders())
      .map((response) => response);
  }

  removeNote(userId, noteId) {
    return this.http.delete(`${API_ENDPOINT}/users/${userId}/notes/${noteId}`, this.auth.generateHttpHeaders())
      .map((response) => response);
  }

  updateUserNotes() {
    this.notesChanged.emit();
  }

  getAuthors() {
    return this.http.get(`${API_ENDPOINT}/endpoints/authors`, this.auth.generateHttpHeaders())
      .map((data: Response) => data.json());
  }
}
