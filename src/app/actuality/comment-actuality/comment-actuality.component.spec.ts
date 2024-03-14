import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentActualityComponent } from './comment-actuality.component';

describe('CommentActualityComponent', () => {
  let component: CommentActualityComponent;
  let fixture: ComponentFixture<CommentActualityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentActualityComponent]
    });
    fixture = TestBed.createComponent(CommentActualityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
