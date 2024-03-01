import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentInterfaceComponent } from './comment.interface.component';

describe('CommentInterfaceComponent', () => {
  let component: CommentInterfaceComponent;
  let fixture: ComponentFixture<CommentInterfaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentInterfaceComponent]
    });
    fixture = TestBed.createComponent(CommentInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
