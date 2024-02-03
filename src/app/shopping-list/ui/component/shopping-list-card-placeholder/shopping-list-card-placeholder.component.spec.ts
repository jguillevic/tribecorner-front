import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShoppingListCardPlaceholderComponent} from './shopping-list-card-placeholder.component';

describe('ShoppingListLoadingCardComponent', () => {
  let component: ShoppingListCardPlaceholderComponent;
  let fixture: ComponentFixture<ShoppingListCardPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoppingListCardPlaceholderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShoppingListCardPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
