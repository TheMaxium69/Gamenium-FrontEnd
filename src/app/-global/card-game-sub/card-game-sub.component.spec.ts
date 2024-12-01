import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGameSubComponent } from './card-game-sub.component';

describe('CardGameSubComponent', () => {
  let component: CardGameSubComponent;
  let fixture: ComponentFixture<CardGameSubComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardGameSubComponent]
    });
    fixture = TestBed.createComponent(CardGameSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
