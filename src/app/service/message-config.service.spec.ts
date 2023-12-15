import { TestBed } from '@angular/core/testing';

import { MessageConfigService } from './message-config.service';

describe('MessageConfigService', () => {
  let service: MessageConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
