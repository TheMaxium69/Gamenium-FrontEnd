import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeInterfaceComponent } from './badge.interface.component';

describe('BadgeInterfaceComponent', () => {
  let component: BadgeInterfaceComponent;
  let fixture: ComponentFixture<BadgeInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BadgeInterfaceComponent]
    });
    fixture = TestBed.createComponent(BadgeInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
