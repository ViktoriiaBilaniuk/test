import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { PaginationComponent } from './pagination.component';

let comp: PaginationComponent;
let fixture: ComponentFixture<PaginationComponent>;
let de: DebugElement;
let el: HTMLElement;

describe('Pagination component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaginationComponent]
        }).compileComponents();

        // creates an instance of PaginationComponent and returns a component test fixture.
        fixture = TestBed.createComponent(PaginationComponent);

        comp = fixture.debugElement.componentInstance; // PaginationComponent test instance

        // handle on the component's DOM element.
        // The query method takes a predicate function and searches the fixture's
        // entire DOM tree for the first element that satisfies the predicate.
        de = fixture.debugElement;
    }));

    it('should have a defined component', () => {
        expect(comp).toBeDefined();
    });

    it('should have right initial offset', () => {
        let defaultComponentOffset = 0;
        expect(comp.offset).toEqual(defaultComponentOffset);
    });

    it('range method should generate correct range array', () => {
        let rangeArr = comp.range(0, 4);
        expect(rangeArr).toEqual([0, 1, 2, 3]);

        let increasedIntRangeArray = comp.range(0, 10, 2);
        expect(increasedIntRangeArray).toEqual([0, 2, 4, 6, 8]);
    });

    it('onChangePage method should work correctly', () => {
        let clickedPage = 5;
        comp.onChangePage(clickedPage);
        expect(comp.offset).toBe(40);
        expect(comp.currentPage).toBe(clickedPage);
    });
});
