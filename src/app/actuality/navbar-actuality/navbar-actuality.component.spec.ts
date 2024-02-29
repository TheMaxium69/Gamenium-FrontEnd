import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarActualityComponent } from './navbar-actuality.component';

describe('NavbarActualityComponent', () => {
  let component: NavbarActualityComponent;
  let fixture: ComponentFixture<NavbarActualityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarActualityComponent]
    });
    fixture = TestBed.createComponent(NavbarActualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
