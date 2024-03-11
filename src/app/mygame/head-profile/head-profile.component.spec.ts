import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadProfileComponent } from './head-profile.component';

describe('HeadProfileComponent', () => {
  let component: HeadProfileComponent;
  let fixture: ComponentFixture<HeadProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadProfileComponent]
    });
    fixture = TestBed.createComponent(HeadProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
