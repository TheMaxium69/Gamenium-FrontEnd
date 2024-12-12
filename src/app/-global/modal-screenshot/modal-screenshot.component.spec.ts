import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalScreenshotComponent } from './modal-screenshot.component';

describe('ModalScreenshotComponent', () => {
  let component: ModalScreenshotComponent;
  let fixture: ComponentFixture<ModalScreenshotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalScreenshotComponent]
    });
    fixture = TestBed.createComponent(ModalScreenshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
