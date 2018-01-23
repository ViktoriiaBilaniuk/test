import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'hr-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['pagination.component.sass']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() count: number;
  @Input() offset = 0;
  @Output() changePageEvent = new EventEmitter();

  pagesArr: number[];
  private limit = 10;
  public currentPage: number;

  ngOnInit() {
    this.currentPage = (this.offset / this.limit) + 1;
  }

  ngOnChanges() {
    this.currentPage = (this.offset / this.limit) + 1;
    if (typeof this.count === 'number') {
      this.pagesArr = this.range(1, Math.ceil(this.count / this.limit) + 1);
    }
  }

  /**
   * @description - Generate array of numbers between range
   * @param {any} begin
   * @param {any} end
   * @param {number} [interval=1]
   * @memberOf PaginationComponent
   */
  range(begin, end, interval = 1) {
    const pagesArr = [];
    for (let i = begin; i < end; i += interval) {
      pagesArr.push(i);
    }
    return pagesArr;
  }

  /**
   * @description - handle click on page
   * > Set new offset value and current page value
   * > Emit changePageEvent to parent
   * @param {any} page
   * @memberOf PaginationComponent
   */
  onChangePage(page) {
    this.offset = (page - 1) * this.limit;
    this.currentPage = page;
    this.changePageEvent.emit(this.offset);
  }
}
