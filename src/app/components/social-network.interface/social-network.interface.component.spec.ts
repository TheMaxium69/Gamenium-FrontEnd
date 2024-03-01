import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialNetworkInterfaceComponent } from './social-network.interface.component';

describe('SocialNetworkInterfaceComponent', () => {
  let component: SocialNetworkInterfaceComponent;
  let fixture: ComponentFixture<SocialNetworkInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialNetworkInterfaceComponent]
    });
    fixture = TestBed.createComponent(SocialNetworkInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
