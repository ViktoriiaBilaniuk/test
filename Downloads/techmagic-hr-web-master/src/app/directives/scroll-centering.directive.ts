import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[hrScrollCentering]'
})
export class ScrollCenteringDirective implements OnInit{
  @Input() target;
  @Input() isCenter;
  @Input() currentIndex;
  @Input() calendar;
  pixelCount = 0;
  sizeOfCell = 28;
  monthBorder = 0;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if(this.isCenter) {
      for (let i = 0; i < this.calendar.length; i++) {
        if ((this.currentIndex) === i) {
          break;
        }

        this.pixelCount = this.pixelCount + this.monthBorder + (this.sizeOfCell * this.calendar[i].days.length);
      }

      setTimeout(() => {this.target.scrollLeft = this.pixelCount}, 0);
    }
  }
}
