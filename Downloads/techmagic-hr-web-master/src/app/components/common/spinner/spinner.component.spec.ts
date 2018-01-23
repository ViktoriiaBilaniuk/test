import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import {SpinnerComponent} from './spinner.component';

let comp:    SpinnerComponent;
let fixture: ComponentFixture<SpinnerComponent>;
let de:      DebugElement;
let el:      HTMLElement;

describe('SpinnerComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SpinnerComponent // declare the test component
      ],
    }).compileComponents(); // compile template and css

    fixture = TestBed.createComponent(SpinnerComponent); // creates an instance of SpinnerComponent and returns a component test fixture.
    comp = fixture.debugElement.componentInstance; // SpinnerComponent test instance

    // handle on the component's DOM element.
    // The query method takes a predicate function and searches the fixture's
    // entire DOM tree for the first element that satisfies the predicate.
    de = fixture.debugElement;

    // Get native dom element
    el = de.nativeElement;
  }));

  it('should have a defined component', () => {
    expect(comp).toBeDefined();
  });

  it('should have correct markup', () => {
    expect(el.children.length).toBe(1);

    let childOfRootNode =  el.children[0];
    expect(childOfRootNode.id).toBe('loading-spinner');
    expect(childOfRootNode.className).toBe('spinner-wrapper spinner-hidden');
    expect(childOfRootNode.children.length).toBe(1);
    expect(childOfRootNode.children[0].className).toBe('spinner');
  });

});
