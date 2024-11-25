import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddGameUnselectComponent } from './modal-add-game-unselect.component';

describe('ModalAddGameUnselectComponent', () => {
  let component: ModalAddGameUnselectComponent;
  let fixture: ComponentFixture<ModalAddGameUnselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAddGameUnselectComponent]
    });
    fixture = TestBed.createComponent(ModalAddGameUnselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
