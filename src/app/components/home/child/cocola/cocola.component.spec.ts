/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CocolaComponent } from './cocola.component';

describe('CocolaComponent', () => {
  let component: CocolaComponent;
  let fixture: ComponentFixture<CocolaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CocolaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CocolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
