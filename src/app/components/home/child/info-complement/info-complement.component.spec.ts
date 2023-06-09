/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InfoComplementComponent } from './info-complement.component';

describe('InfoComplementComponent', () => {
  let component: InfoComplementComponent;
  let fixture: ComponentFixture<InfoComplementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoComplementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComplementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
