import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[hrSyncScroll]'
})
export class SyncScrollDirective {
  @Input() synchScrollTargets;

  constructor(private el: ElementRef) { }

  @HostListener('scroll') onElementScroll() {
    if (this.synchScrollTargets && this.synchScrollTargets.scrollTop !== this.el.nativeElement.scrollTop) {
      this.synchScrollTargets.scrollTop = this.el.nativeElement.scrollTop;
    }
  }
}
