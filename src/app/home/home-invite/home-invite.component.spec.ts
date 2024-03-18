import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeInviteComponent } from './home-invite.component';

describe('HomeInviteComponent', () => {
  let component: HomeInviteComponent;
  let fixture: ComponentFixture<HomeInviteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeInviteComponent]
    });
    fixture = TestBed.createComponent(HomeInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
