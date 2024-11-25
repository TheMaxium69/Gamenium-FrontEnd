import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddGameComponent } from './modal-add-game.component';

describe('ModalAddGameComponent', () => {
  let component: ModalAddGameComponent;
  let fixture: ComponentFixture<ModalAddGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAddGameComponent]
    });
    fixture = TestBed.createComponent(ModalAddGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
