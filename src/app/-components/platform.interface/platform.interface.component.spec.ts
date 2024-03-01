import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformInterfaceComponent } from './platform.interface.component';

describe('PlatformInterfaceComponent', () => {
  let component: PlatformInterfaceComponent;
  let fixture: ComponentFixture<PlatformInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformInterfaceComponent]
    });
    fixture = TestBed.createComponent(PlatformInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
