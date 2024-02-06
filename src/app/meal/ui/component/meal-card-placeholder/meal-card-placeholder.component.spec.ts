import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealCardPlaceholderComponent } from './meal-card-placeholder.component';

describe('MealCardPlaceholderComponent', () => {
  let component: MealCardPlaceholderComponent;
  let fixture: ComponentFixture<MealCardPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MealCardPlaceholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MealCardPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
