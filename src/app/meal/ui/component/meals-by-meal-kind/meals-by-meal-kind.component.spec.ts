import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealsByMealKindComponent } from './meals-by-meal-kind.component';

describe('MealsByMealKindComponent', () => {
  let component: MealsByMealKindComponent;
  let fixture: ComponentFixture<MealsByMealKindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealsByMealKindComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealsByMealKindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
