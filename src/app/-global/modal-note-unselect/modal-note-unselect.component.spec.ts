import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoteUnselectComponent } from './modal-note-unselect.component';

describe('ModalNoteUnselectComponent', () => {
  let component: ModalNoteUnselectComponent;
  let fixture: ComponentFixture<ModalNoteUnselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNoteUnselectComponent]
    });
    fixture = TestBed.createComponent(ModalNoteUnselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
