import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardActuComponent } from './card-actu.component';

describe('CardActuComponent', () => {
  let component: CardActuComponent;
  let fixture: ComponentFixture<CardActuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardActuComponent]
    });
    fixture = TestBed.createComponent(CardActuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
