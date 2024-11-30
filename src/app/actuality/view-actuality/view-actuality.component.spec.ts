import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardActualityComponent } from './card-actuality.component';

describe('CardActualityComponent', () => {
  let component: CardActualityComponent;
  let fixture: ComponentFixture<CardActualityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardActualityComponent]
    });
    fixture = TestBed.createComponent(CardActualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
