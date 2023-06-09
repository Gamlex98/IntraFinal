/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AccordionTemplate } from './accordion.component';

describe('AccordionComponent', () => {
  let component: AccordionTemplate;
  let fixture: ComponentFixture<AccordionTemplate>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccordionTemplate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccordionTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
