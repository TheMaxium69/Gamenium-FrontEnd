import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProfilComponent } from './card-profil.component';

describe('CardProfilComponent', () => {
  let component: CardProfilComponent;
  let fixture: ComponentFixture<CardProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardProfilComponent]
    });
    fixture = TestBed.createComponent(CardProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
