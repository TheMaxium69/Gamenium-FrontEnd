import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikeInterfaceComponent } from './like.interface.component';

describe('LikeInterfaceComponent', () => {
  let component: LikeInterfaceComponent;
  let fixture: ComponentFixture<LikeInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LikeInterfaceComponent]
    });
    fixture = TestBed.createComponent(LikeInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
