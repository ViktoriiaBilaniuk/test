import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'hr-file-button',
    templateUrl: './file-button.component.html',
    styleUrls: ['file-button.sass']
})

export class FileButtonComponent {
    @Input() accept: string;
    @Input() disabled: boolean;
    @Input() btnTitle: string;
    @Output('change') change: EventEmitter<Event> = new EventEmitter();
    constructor() { }

    fileChange(event) {
        event.stopPropagation();
        this.change.emit(event);
    }

}
