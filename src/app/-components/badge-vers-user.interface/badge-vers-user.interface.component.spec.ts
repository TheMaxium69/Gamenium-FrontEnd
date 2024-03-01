import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeVersUserInterfaceComponent } from './badge-vers-user.interface.component';

describe('BadgeVersUserInterfaceComponent', () => {
  let component: BadgeVersUserInterfaceComponent;
  let fixture: ComponentFixture<BadgeVersUserInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BadgeVersUserInterfaceComponent]
    });
    fixture = TestBed.createComponent(BadgeVersUserInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
