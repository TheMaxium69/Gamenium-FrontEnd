import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBuywhereComponent } from './modal-buywhere.component';

describe('ModalBuywhereComponent', () => {
  let component: ModalBuywhereComponent;
  let fixture: ComponentFixture<ModalBuywhereComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalBuywhereComponent]
    });
    fixture = TestBed.createComponent(ModalBuywhereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
