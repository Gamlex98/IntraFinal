/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CopasoComponent } from './copaso.component';

describe('CopasoComponent', () => {
  let component: CopasoComponent;
  let fixture: ComponentFixture<CopasoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopasoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
