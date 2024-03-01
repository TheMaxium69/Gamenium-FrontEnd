import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInterfaceComponent } from './game.interface.component';

describe('GameInterfaceComponent', () => {
  let component: GameInterfaceComponent;
  let fixture: ComponentFixture<GameInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameInterfaceComponent]
    });
    fixture = TestBed.createComponent(GameInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
