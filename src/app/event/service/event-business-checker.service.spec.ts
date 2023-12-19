import { TestBed } from '@angular/core/testing';

import { EventBusinessCheckerService } from './event-business-checker.service';

describe('EventBusinessCheckerService', () => {
  let service: EventBusinessCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventBusinessCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
