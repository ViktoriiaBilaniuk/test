import {Router, ActivatedRoute} from '@angular/router';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {NotesService, UsersService} from './../../../../../services';
import {USER, NOTE} from './../../../../../models';

@Component({
  selector: 'hr-notes-form',
  templateUrl: 'notes-form.component.html',
  styleUrls: ['notes-form.component.sass']
})
export class NotesFormComponent implements OnInit, OnDestroy {
  noteId: string;
  note: NOTE = {};
  authors: USER[];
  formIsSubmited: boolean;
  invalidNoteDate: boolean;
  private subscription: Subscription;
  private user: USER = this.usersService.getStoredUser();

  constructor(private router: Router,
              public activatedRoute: ActivatedRoute,
              private notesService: NotesService,
              private usersService: UsersService) {}

  ngOnInit() {
    this.initDatePicker();
    this.getParams();
    this.getAuthors();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getParams() {
    this.subscription = this.activatedRoute.params.subscribe(
      (param: any) => {
        this.noteId = param['noteId'];
        if (this.noteId) {
          if (this.user.notes) {
            this.setUpNote();
          } else {
            this.goToList();
          }
        } else {
          this.note._author = {_id: ''};
        }
      },
      error => console.error('Error: ', error)
    );
  }

  setUpNote() {
    this.note = this.notesService.getNote(this.noteId);
    $('#datepicker-note').datepicker('setUTCDate', new Date(this.note.createdAt));
  }

  getAuthors() {
    this.notesService.getAuthors().subscribe(
      (data) => this.authors = data,
      (error) => console.error('Error:', error)
    );
  }

  goToList() {
    this.router.navigate([`/employees/list/${this.user._id}/notes/list`]);
  }

  onSubmit(notesForm) {
    if (notesForm.valid && $('#datepicker-note').datepicker('getDate')) {
      notesForm.value.createdAt = new Date($('#datepicker-note').datepicker('getUTCDate')).getTime();
      if (this.noteId) {
        this.updateNote(notesForm.value);
      } else {
        this.createNote(notesForm.value);
      }
    } else {
      this.showValidation();
    }
  }

  showValidation() {
    this.formIsSubmited = true;
    $('#noteForm').addClass('submited');
    if ($('#datepicker-note').datepicker('getUTCDate') === null) {
      $('#datepicker-note').addClass('ng-invalid');
      this.invalidNoteDate = true;
      $('#datepicker-note').datepicker().on('changeDate', () => {
        $('#datepicker-note').removeClass('ng-invalid');
        this.invalidNoteDate = false;
      });
    }

  }

  createNote(formData) {
    this.notesService.createNote(this.user._id, formData).subscribe(
      () => {
        this.notesService.updateUserNotes();
        this.goToList();
      },
      (error) => console.error('Error', error)
    );
  }

  updateNote(formData) {
    this.notesService.updateNote(this.user._id, this.noteId, formData).subscribe(
      () => {
        this.notesService.updateUserNotes();
        this.goToList();
      },
      (error) => console.error('Error', error)
    );
  }

  removeNote() {
    this.notesService.removeNote(this.user._id, this.noteId).subscribe(
      () => {
        this.notesService.updateUserNotes();
        this.goToList();
      },
      (error) => console.error('Error', error)
    );
  }

  initDatePicker() {
    $('#datepicker-note').datepicker({
      todayHighlight: true,
      autoclose: true,
      format: 'dd/mm/yyyy'
    });
  }
}
