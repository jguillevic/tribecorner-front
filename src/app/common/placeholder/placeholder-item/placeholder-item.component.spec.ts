import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderItemComponent } from './placeholder-item.component';

describe('PlaceholderItemComponent', () => {
  let component: PlaceholderItemComponent;
  let fixture: ComponentFixture<PlaceholderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceholderItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceholderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
