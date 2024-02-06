import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsByMealKindPlaceholderComponent } from './meals-by-meal-kind-placeholder.component';

describe('MealsByMealKindPlaceholderComponent', () => {
  let component: MealsByMealKindPlaceholderComponent;
  let fixture: ComponentFixture<MealsByMealKindPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealsByMealKindPlaceholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealsByMealKindPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
