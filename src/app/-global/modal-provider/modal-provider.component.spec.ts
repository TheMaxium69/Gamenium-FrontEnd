import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProviderComponent } from './modal-provider.component';

describe('ModalProviderComponent', () => {
  let component: ModalProviderComponent;
  let fixture: ComponentFixture<ModalProviderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalProviderComponent]
    });
    fixture = TestBed.createComponent(ModalProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
