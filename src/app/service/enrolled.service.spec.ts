import { TestBed } from '@angular/core/testing';

import { EnrolledService } from './enrolled.service';

describe('EnrolledService', () => {
  let service: EnrolledService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrolledService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
