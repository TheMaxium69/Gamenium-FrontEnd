import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAccountExterneInterfaceComponent } from './my-account-externe.interface.component';

describe('MyAccountExterneInterfaceComponent', () => {
  let component: MyAccountExterneInterfaceComponent;
  let fixture: ComponentFixture<MyAccountExterneInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyAccountExterneInterfaceComponent]
    });
    fixture = TestBed.createComponent(MyAccountExterneInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
