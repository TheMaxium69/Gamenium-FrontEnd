import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccountProfileComponent } from './no-account-profile.component';

describe('NoAccountProfileComponent', () => {
  let component: NoAccountProfileComponent;
  let fixture: ComponentFixture<NoAccountProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoAccountProfileComponent]
    });
    fixture = TestBed.createComponent(NoAccountProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
