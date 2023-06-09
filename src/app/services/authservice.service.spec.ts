/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthserviceService } from './authservice.service';

describe('Service: Authservice', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthserviceService]
    });
  });

  it('should ...', inject([AuthserviceService], (service: AuthserviceService) => {
    expect(service).toBeTruthy();
  }));
});
