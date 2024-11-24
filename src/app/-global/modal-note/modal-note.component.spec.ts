import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoteComponent } from './modal-note.component';

describe('ModalNoteComponent', () => {
  let component: ModalNoteComponent;
  let fixture: ComponentFixture<ModalNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNoteComponent]
    });
    fixture = TestBed.createComponent(ModalNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
