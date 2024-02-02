import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListLoadingCardComponent } from './shopping-list-loading-card.component';

describe('ShoppingListLoadingCardComponent', () => {
  let component: ShoppingListLoadingCardComponent;
  let fixture: ComponentFixture<ShoppingListLoadingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListLoadingCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingListLoadingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
