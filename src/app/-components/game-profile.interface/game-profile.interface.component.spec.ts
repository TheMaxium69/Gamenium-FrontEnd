import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameProfileInterfaceComponent } from './game-profile.interface.component';

describe('GameProfileInterfaceComponent', () => {
  let component: GameProfileInterfaceComponent;
  let fixture: ComponentFixture<GameProfileInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameProfileInterfaceComponent]
    });
    fixture = TestBed.createComponent(GameProfileInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
