import { TestBed } from '@angular/core/testing';

import { MealGoToService } from './meal-go-to.service';

describe('MealGoToService', () => {
  let service: MealGoToService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MealGoToService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
