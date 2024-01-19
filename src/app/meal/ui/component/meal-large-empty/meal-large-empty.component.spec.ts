import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealLargeEmptyComponent } from './meal-large-empty.component';

describe('MealLargeEmptyComponent', () => {
  let component: MealLargeEmptyComponent;
  let fixture: ComponentFixture<MealLargeEmptyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MealLargeEmptyComponent]
    });
    fixture = TestBed.createComponent(MealLargeEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
