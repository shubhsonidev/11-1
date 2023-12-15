import { TestBed } from '@angular/core/testing';

import { EnrolledListService } from './enrolled-list.service';

describe('EnrolledListService', () => {
  let service: EnrolledListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrolledListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
