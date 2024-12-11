import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTagComponent } from './modal-tag.component';

describe('ModalTagComponent', () => {
  let component: ModalTagComponent;
  let fixture: ComponentFixture<ModalTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalTagComponent]
    });
    fixture = TestBed.createComponent(ModalTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
