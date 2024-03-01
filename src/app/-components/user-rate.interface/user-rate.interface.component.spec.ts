import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRateInterfaceComponent } from './user-rate.interface.component';

describe('UserRateInterfaceComponent', () => {
  let component: UserRateInterfaceComponent;
  let fixture: ComponentFixture<UserRateInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRateInterfaceComponent]
    });
    fixture = TestBed.createComponent(UserRateInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
