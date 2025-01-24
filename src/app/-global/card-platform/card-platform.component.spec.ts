import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPlatformComponent } from './card-platform.component';

describe('CardPlatformComponent', () => {
  let component: CardPlatformComponent;
  let fixture: ComponentFixture<CardPlatformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardPlatformComponent]
    });
    fixture = TestBed.createComponent(CardPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
