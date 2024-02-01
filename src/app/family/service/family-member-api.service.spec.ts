import { TestBed } from '@angular/core/testing';

import { FamilyMemberApiService } from './family-member-api.service';

describe('FamilyMemberApiService', () => {
  let service: FamilyMemberApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyMemberApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
