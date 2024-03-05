import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameProfileComponent } from './game-profile.component';

describe('GameProfileComponent', () => {
  let component: GameProfileComponent;
  let fixture: ComponentFixture<GameProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameProfileComponent]
    });
    fixture = TestBed.createComponent(GameProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
