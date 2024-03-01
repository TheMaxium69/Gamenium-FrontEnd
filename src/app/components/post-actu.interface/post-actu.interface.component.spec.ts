import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostActuInterfaceComponent } from './post-actu.interface.component';

describe('PostActuInterfaceComponent', () => {
  let component: PostActuInterfaceComponent;
  let fixture: ComponentFixture<PostActuInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostActuInterfaceComponent]
    });
    fixture = TestBed.createComponent(PostActuInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
