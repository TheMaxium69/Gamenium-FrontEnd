import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryMyGameInterfaceComponent } from './history-my-game.interface.component';

describe('HistoryMyGameInterfaceComponent', () => {
  let component: HistoryMyGameInterfaceComponent;
  let fixture: ComponentFixture<HistoryMyGameInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryMyGameInterfaceComponent]
    });
    fixture = TestBed.createComponent(HistoryMyGameInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
