import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPlatformComponent } from './modal-add-platform.component';

describe('ModalAddPlatformComponent', () => {
  let component: ModalAddPlatformComponent;
  let fixture: ComponentFixture<ModalAddPlatformComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalAddPlatformComponent]
    });
    fixture = TestBed.createComponent(ModalAddPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
